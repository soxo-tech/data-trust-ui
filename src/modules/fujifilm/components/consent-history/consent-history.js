/***
 *Component for Consent History
 *
 * @description
 * @author Sameena
 */


import React, { useState, useEffect } from 'react';

import { Table, Button, Typography, Skeleton, } from 'antd';

import { Location, Card, DateUtils } from 'soxo-bootstrap-core';

import ConsentDetails from '../consent-details/consent-details';

import './consent-history.scss';

import { UploadDetails } from '../../../../models';

const { Title } = Typography;

export default function ConsentHistory({ffmenu, ...props }) {

    const [consentHistory, setConsentHistory] = useState([])

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(20);

    const { id } = props.match.params;

    const [loading, setLoading] = useState(true)

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (value, item, index) => {
                return (page - 1) * limit + index + 1;
            },
        },
        {
            title: 'Consent ID',
            key: 'id',
            render: (record) => {

                return record.upload_details[0].id

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

                const attributes = JSON.parse(record.upload_details[0].attributes)

                return attributes.lifetime_type ? attributes.lifetime_type : attributes.lifeTime;
            }
        },
        {
            title: 'Items',
            key: 'items',
            render: (record) => {

                const attributes = JSON.parse(record.upload_details[0].attributes)

                return attributes.items;
            }
        }]

    //Extra columns for fujifilm
    if (ffmenu) {

        columns.push(
            {
                title: 'Registration Date',
                key: 'regDate',
                render: (record) => {

                    return DateUtils.getFormattedTimeDate(record.upload_details[0].order_date)

                }
            },
            {
                title: 'Last Download',
                key: 'lastDownlaod',
                render: (record) => {

                    return record.download.created_at?DateUtils.getFormattedTimeDate(record.download.created_at):null
                    

                }
            },
            {
                title: 'Discarded date',
                key: 'discarded',
                render: (record) => {

                    const attributes = JSON.parse(record.upload_details[0].attributes)
    
                    return attributes.items==='none'?DateUtils.getFormattedTimeDate(record.upload_details[0].created_at):null;
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
                        url: `/checkup-list/downloads-history/${id}?&consentId=${ele.upload_details[0].id}`,
                    });
                }

                function toDerivedAnalysis() {

                    Location.navigate({
                        url: `/checkup-list/derived-analysis/${id}`,
                    });
                }

                return (

                    <div>
                        {ffmenu ?

                           <Button onClick={onDiscard}>Discard</Button> :

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

    function onDiscard() {

    }


    useEffect(() => {
        getData();

    }, [])

    function getData() {

        UploadDetails.getConsent(id).then(result => {
            setConsentHistory(result.uploadsWithConsent)
            setLoading(false)
        })
    }

    return (
        loading ? <Skeleton /> :
            <>
                <div>
                    <Title level={3}>Consent History</Title>

                    <div className='consent-history'>

                        <Card className={'history'}>
                            <div className='history-table'>
                                <Title level={5}>Nura ID : {id}</Title>

                                <p> {consentHistory && consentHistory[0] && consentHistory[0].upload_details ? DateUtils.formatDate(consentHistory[0].upload_details[0].order_date) : null}</p>
                            </div>

                            <Table
                                scroll={{ x: true }}
                                dataSource={consentHistory}
                                columns={columns}
                            />
                        </Card>
                        {/* {ffmenu ? null :
                            <Card className={'details'}>
                                <ConsentDetails />
                            </Card>} */}
                    </div>
                </div>
            </>


    )
}

