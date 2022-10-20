/***
 *
 *
 * @description
 * @author Sameena
 */

/**
 * Check Up data Listing Component
 */

import React, { useState, useEffect } from 'react';

import { Table, Button, Typography, Dropdown, Menu, Skeleton } from 'antd';

import { Location, Card } from 'soxo-bootstrap-core';

import './derived-analysis.scss';

import ConsentDetails from '../consent-details/consent-details';

import { MoreOutlined } from '@ant-design/icons';

import { UploadDetails, CoreUsers,Uploads } from '../../../../models';

import moment from 'moment'

const { Title, Text } = Typography;


export default function DerivedAnalysis({ ...props }) {

        const { id } = props.match.params; //Get pagination number

        const [derivedAnalysis, setDerivedAnalysis] = useState([])

        const [loading, setLoading] = useState(false);

        const [page, setPage] = useState(1);

        const [limit, setLimit] = useState(20);

        //ffmenu is maintaine to determine which user is using(nura or fujifilm)
        const [ffmenu, setFFmenu] = useState(true)


        const columns = [
                {
                        title: '#',
                        dataIndex: 'index',
                        render: (value, item, index) => {
                                return (page - 1) * limit + index + 1;
                        },
                },
                {
                        title: 'Data ID',
                        key: 'id',
                        dataIndex: 'id'
                },
                {
                        title: 'Content Source ID',
                        key: 'source',
                        dataIndex: 'source'
                },
                {
                        title: 'Title',
                        key: 'title',
                        dataIndex: 'title'
                },
                {
                        title: 'Upload Date',
                        key: 'date',
                        render: (record) => {

                                return moment(record.created_at).format('DD/MM/YYYY')

                        }
                },
                {
                        title: 'Upload User',
                        key: 'user',
                        render: (record) => {
                                return record.created_by_details['name']

                        }
                },
        ]

        useEffect(() => {
                getData();

        }, [])


        /**
         * Function to load the data for screen
         */
        function getData() {

                setLoading(true);

                UploadDetails.loadDetails(id).then(result => {
                        // setDetails(result.result)
                        console.log(result)

                        // setUploads(result);

                        //   setDerivedAnalysis(result.uploadsWithConsent);

                        Promise.all(result.uploadsWithConsent.map(async (ele, key) => {
                                var id = ele.created_by
                                var user = await CoreUsers.getRecord({ id })
                                return {
                                        ...ele,
                                        created_by_details: user.result
                                }
                        })).then((arr) => {
                                setDerivedAnalysis(arr)
                                setLoading(false)
                        })

                        setLoading(false);

                })
        }


        //Extra columns for fujifilm
        if (ffmenu) {
                columns.push({
                        title: 'Last Download',
                        key: 'lastDownload',
                        dataIndex: 'lastDownload'
                })
        }

        columns.push(
                {
                        title: 'Action',
                        key: 'action',
                        render: (ele) => {

                                return (
                                        <div>
                                                <div style={{ display: 'flex' }}>
                                                        <Button onClick={(e)=>download(e,ele)}>Download</Button>


                                                        {ffmenu ?

                                                                <Dropdown overlay={() => {
                                                                        return menu(ele)
                                                                }} placement="bottomLeft">

                                                                        <MoreOutlined />

                                                                </Dropdown> : null}
                                                </div>
                                        </div>

                                )
                        },
                },
        )


        /**
         * Function for download
         */
        function download(e,record) {

                Uploads.downloadFiles(record.id).then((res) => {

                        Uploads.download(res.data)
                       
                        console.log(res)
                   })

        }


        /**
         * Open menu with additional options
         */
        const menu = (record) => {
                return (
                        <Menu onClick={(event) => {

                                handleClick(event, record);

                        }}>
                                <Menu.Item key="download_history" >
                                        Download History
                                </Menu.Item>

                                <Menu.Item key="result_analysis" >
                                        Result Analysis
                                </Menu.Item>
                        </Menu>
                )
        }



        function handleClick(params, record) {
                if (params.key === 'download_history')
                        Location.navigate({
                                url: `/checkup-list/downloads-history/${record.id}`,
                        });

                else if (params.key === 'result_analysis') {
                        Location.navigate({
                                url: `/analysis-result`,
                        });
                }
        }


        return (
                <div>

                        <Title level={3}>DERIVED ANALYSIS RESULT </Title>
                        {loading ? <Skeleton /> : <>

                                {/* <div className='derived-analysis'>
                                                  <div>
                                                            <Title level={5}> Nura ID</Title>
                                                            <p>NURA45</p>
                                                  </div>
                                                  <div className='details'>
                                                            <p>Consent ID: 2541252</p>
                                                            <p>Registration Date:26/02/2022</p>
                                                  </div>

                                        </div> */}
                                <div className='derived-card'>
                                        <Card className={'table'}>
                                                <Table
                                                        scroll={{ x: true }}
                                                        //  rowKey={(record) => record.da_id}
                                                        dataSource={derivedAnalysis}
                                                        columns={columns}
                                                // pagination={{
                                                //     current: page,
                                                //     onChange(current) {
                                                //         setPage(current);
                                                //     },
                                                // }}
                                                />
                                        </Card>
                                        {/* <Card className={'details'}><ConsentDetails /></Card> */}
                                </div>
                        </>}

                </div>


        )
}

