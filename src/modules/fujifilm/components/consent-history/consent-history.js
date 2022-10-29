/***
 *Component for Consent History
 *
 * @description
 * @author Sameena
 */


import React, { useState, useEffect } from 'react';

import { Table, Button, Typography, Skeleton, } from 'antd';

import { Location, Card,DateUtils } from 'soxo-bootstrap-core';

import ConsentDetails from '../consent-details/consent-details';

import './consent-history.scss';

import moment from 'moment';

import { UploadDetails } from '../../../../models';

const { Title, Text } = Typography;

export default function ConsentHistory({ ...props }) {

    const [consentHistory, setConsentHistory] = useState([])

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(20);


    const { id } = props.match.params;

    //ffmenu is maintaine to determine which user is using(nura or fujifilm)
    const [ffmenu, setFFmenu] = useState(false)

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

                return attributes.lifetime_type?attributes.lifetime_type:attributes.lifeTime;
            }
        },
        {
            title: 'Items',
            key: 'items',
            render: (record) => {

                const attributes = JSON.parse(record.upload_details[0].attributes)

                return attributes.items;
            }
        },


    ]

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
                dataIndex: 'lastDownload'
            },
            {
                title: 'Discarded date',
                key: 'discarded',
                dataIndex: 'discarded'
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
                        url: `/checkup-list/downloads-history/${id}`,
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

                                
                                <p> {consentHistory && consentHistory[0]&&consentHistory[0].upload_details ?DateUtils.formatDate(consentHistory[0].upload_details[0].order_date):null}</p>
                                
                            </div>

                            <Table
                                scroll={{ x: true }}
                                //  rowKey={(record) => record.da_id}
                                dataSource={consentHistory}
                                columns={columns}
                            // pagination={{
                            //     current: page,
                            //     onChange(current) {
                            //         setPage(current);
                            //     },
                            // }}
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

