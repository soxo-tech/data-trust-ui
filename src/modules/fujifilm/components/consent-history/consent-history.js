/***
 *Component for Consent History
 *
 * @description
 * @author Sameena
 */


import React, { useState, useEffect, useContext } from 'react';

import { Table, Button, Typography, Skeleton, message, Popconfirm, Tag } from 'antd';

import { Location, DateUtils, GlobalContext } from 'soxo-bootstrap-core';

import './consent-history.scss';

import { UploadDetails } from '../../../../models';

import ErrorBoundary from '../error';

const { Title } = Typography;

export default function ConsentHistory({ ffmenu, id, data_id, setConsentId, setConsent, mode, isCheckup, ...props }) {

    let urlParams = Location.search();

    if (urlParams.data_id)
        data_id = urlParams.data_id

    const [consentHistory, setConsentHistory] = useState([])

    if (props.match)
        id = props.match.params;

    const [loading, setLoading] = useState(true)

    const { user = {} } = useContext(GlobalContext);

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    let columns=[]

    if (!isCheckup)
        columns = [
            {
                title: '#',
                dataIndex: 'index',
                render: (value, item, index) => (page - 1) * limit + index + 1,
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

                    return record.consent_time ? DateUtils.getFormattedTimeDate(record.consent_time) : 'Not Available'

                }
            },
            {
                title: 'Lifetime',
                key: 'lifetime',
                render: (record) => {

                    const attributes = JSON.parse(record.attributes)

                    return attributes.lifetime_type || null
                }
            },
            {
                title: 'Items',
                key: 'items',
                render: (record) => {

                    const attributes = JSON.parse(record.attributes);

                    if (attributes && attributes.items && typeof (attributes.items) === 'string') {

                        return <Tag>{attributes.items}</Tag >;

                    } else {

                        return <Tag>{attributes.items.join(',')}</Tag >

                    }

                }
            }]

    //Extra columns for fujifilm
    if (!isCheckup) {

        columns.push(

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

                    return record.discarded_date ? DateUtils.getFormattedTimeDate(record.discarded_date) : <p>-</p>;
                }
            },
        )


        columns.push(
            {
                title: 'Action',
                key: 'action',
                render: (ele, record) => {

                    function toDownloadHistory() {

                        setConsent(ele.upload_details_id)

                        Location.navigate({
                            url: `/check-up-details/${id}?&consent_id=${ele.upload_details_id}&activeKey=${1}&data_id=${data_id}`,
                        });
                    }

                    function toDerivedAnalysis() {

                        setConsent(ele.upload_details_id)

                        Location.navigate({
                            url: `/check-up-details/${id}?&consentId=${ele.upload_details_id}&activeKey=${2}&data_id=${data_id}`,
                        });
                    }

                    const attributes = JSON.parse(ele.attributes)

                    let checkupId

                    if (attributes.checkup_id)
                        checkupId = attributes.checkup_id;

                    return (

                        <div>
                            {attributes.items === 'all' ? null :
                                <Popconfirm
                                    title="Are you sure you want to discard the consent? "
                                    onConfirm={(e) => onDiscard(e, ele)}
                                    onCancel={() => { }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button disabled={record.discarded_date}>Discard</Button>
                                </Popconfirm>}


                            <Button onClick={toDownloadHistory}>Download History</Button>

                            {/* The analysis result may be loaded with the previous checkup . So we control this feature */}
                            {checkupId == data_id ? <Button onClick={toDerivedAnalysis}>Analysis Result</Button> : null}

                        </div>
                    )
                },
            },
        )
    }

    if (isCheckup) {

        columns = [
            {
                title: '#',
                dataIndex: 'index',
                render: (value, item, index) => (page - 1) * limit + index + 1,
            },
            {
                title: 'Data ID',
                key: 'id',
                render: (record) => {

                    return record.upload_details_id

                }
            },
            {
                title: 'Consent ID',
                key: 'consent_id',
                render: (record) => {
                    const attributes = JSON.parse(record.attributes)

                    return attributes.consent_id

                }
            },
            {
                title: 'Upload Time',
                key: 'time',
                render: (record) => {

                    return record.created_at ? DateUtils.getFormattedTimeDate(record.created_at) : 'Not Available'

                }
            },
            {
                title: 'Consent Time',
                key: 'time',
                render: (record) => {

                    return record.consent&&record.consent.consent_time ? DateUtils.getFormattedTimeDate(record.consent.consent_time) : 'Not Available'

                }
            },


        ]
    }

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
                value: mode
            }, {
                field: 'psuedonymous_nura_id',
                value: id
            }],
            baseUrl: process.env.REACT_APP_NURA
        }

        setLoading(true)

        UploadDetails.getConsent(id, mode).then(result => {

            const attributes = JSON.parse(result.data[0].attributes)

            if (isCheckup)
                setConsentId(attributes.consent_id)

            else if (result.data.length > 0)
                setConsentId(result.data[0].id)

            setConsentHistory(result.data)

            setLoading(false)
        })
    }

    return (
        <ErrorBoundary>
            {loading ? <Skeleton /> :
                <>
                    <div className="card card-shadow">

                        <div className="page-header">

                            {/* <Title level={3}>Consent History</Title> */}

                            <div className="page-actions">

                                {/* <Button onClick={getData}>
                                    <ReloadOutlined />
                                </Button> */}

                            </div>
                        </div>

                        <div className='consent-history'>

                            <div className={'history'}>
                                <div className='history-table'>
                                    {/* <Title level={5}>Nura ID : {id}</Title> */}

                                    {/* <p> {consentHistory && consentHistory[0] ? DateUtils.formatDate(consentHistory[0].order_date) : null}</p> */}

                                </div >

                                <Table
                                    scroll={{ x: 1500 }}
                                    dataSource={consentHistory}
                                    columns={columns}
                                    pagination={{
                                        current: page,
                                        onChange(current) {
                                            setPage(current);
                                        },
                                    }}
                                />
                            </div >
                        </div >
                    </div >
                </>}
        </ErrorBoundary>
    )
}

