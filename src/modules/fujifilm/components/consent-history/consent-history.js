/***
 *Component for Consent History
 *
 * @description
 * @author Sameena
 */


import React, { useState, useEffect, useContext } from 'react';

import { Table, Button, Typography, Skeleton, message, } from 'antd';

import { Location, Card, DateUtils, GlobalContext } from 'soxo-bootstrap-core';

import { ReloadOutlined } from '@ant-design/icons';

import './consent-history.scss';

import { UploadDetails } from '../../../../models';

const { Title } = Typography;

export default function ConsentHistory({ ffmenu, ...props }) {

    const [consentHistory, setConsentHistory] = useState([])

    const { id } = props.match.params;

    const [loading, setLoading] = useState(true)

    const { user = {} } = useContext(GlobalContext);

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (value, item, index) => {
                return index + 1;
                // return (page - 1) * limit + index + 1;
            },
        },
        {
            title: 'Consent ID',
            key: 'id',
            render: (record) => {

                return record.upload_details_id

            }
        },
        {
            title: 'Consent Time',
            key: 'time',
            render: (record) => {

                return DateUtils.getFormattedTimeDate(record.created_at)

            }
        },
        {
            title: 'Lifetime',
            key: 'lifetime',
            render: (record) => {

                const attributes = JSON.parse(record.attributes)

                return attributes && attributes.lifetime_type ? attributes.lifetime_type : attributes && attributes.lifeTime ? attributes.lifeTime : null
            }
        },
        {
            title: 'Items',
            key: 'items',
            render: (record) => {

                const attributes = JSON.parse(record.attributes)

                return attributes && attributes.items ? attributes.items : null;
            }
        }]

    //Extra columns for fujifilm
    if (ffmenu) {

        columns.push(
            // {
            //     title: 'Registration Date',
            //     key: 'regDate',
            //     render: (record) => {

            //         return DateUtils.getFormattedTimeDate(record.order_date)


            //     }
            // },
            {
                title: 'Last Download',
                key: 'lastDownlaod',
                render: (record) => {

                    return record.download && record.download.created_at ? DateUtils.getFormattedTimeDate(record.download.created_at) : null


                }
            },
            {
                title: 'Discarded date',
                key: 'discarded',
                render: (record) => {

                    return record.discarded_date ? DateUtils.getFormattedTimeDate(record.discarded_date) : null;
                }
            },
        )
    }

    columns.push(
        {
            title: 'Action',
            key: 'action',
            render: (ele) => {

                function toDownloadHistory() {

                    Location.navigate({
                        url: `/checkup-list/downloads-history/${id}?&consentId=${ele.upload_details_id}`,
                    });
                }

                function toDerivedAnalysis() {

                    Location.navigate({
                        url: `/checkup-list/derived-analysis/${id}`,
                    });
                }

                const attributes = JSON.parse(ele.attributes)

                return (

                    <div>
                        {ffmenu ? attributes.items === 'all' ? null :


                            <Button onClick={(e) => onDiscard(e, ele)}>Discard</Button> :
                            <>
                                <Button onClick={toDownloadHistory}>Download History</Button>

                                <Button onClick={toDerivedAnalysis}>Analysis Result</Button>
                            </>}
                    </div>
                )
            },
        },
    )

    /**
     * function to discard a consent
     */

    async function onDiscard(e, record) {

        const dataDiscarded = await UploadDetails.discard(record.upload_details_id, user)

        if (dataDiscarded.success) {

            message.success(dataDiscarded.message)
        } else {

            message.error(dataDiscarded.message)
        }
    }

    useEffect(() => {
        getData();

    }, [])

    function getData() {

        const config = {
            queries: [{
                field: 'mode',
                value: 'CONSENT'
            }, {
                field: 'psuedonymous_nura_id',
                value: id
            }],
            baseUrl: process.env.REACT_APP_NURA
        }

        setLoading(true)

        UploadDetails.getConsent(id).then(result => {

            setConsentHistory(result.consents)

            setLoading(false)
        })
    }

    return (
        loading ? <Skeleton /> :
            <>
                <div className="card card-shadow">

                    <div className="page-header">

                        <Title level={3}>Consent History</Title>

                        <div className="page-actions">

                            <Button onClick={getData}>
                                <ReloadOutlined />
                            </Button>

                        </div>
                    </div>

                    <div className='consent-history'>

                        <div className={'history'}>
                            <div className='history-table'>
                                <Title level={5}>Nura ID : {id}</Title>

                               {/* <p> {consentHistory && consentHistory[0] ? DateUtils.formatDate(consentHistory[0].order_date) : null}</p> */}

                            </div >

                            <Table
                                scroll={{ x: true }}
                                dataSource={consentHistory}
                                columns={columns}
                            />
                        </div >
                    </div >
                </div >
            </>
    )
}

