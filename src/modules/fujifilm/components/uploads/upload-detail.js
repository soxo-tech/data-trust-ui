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

import { Table, Button, Typography, Input, Dropdown, Menu, Modal, Skeleton, Popconfirm, message, Tag } from 'antd';

import { Location, Card, DateUtils } from 'soxo-bootstrap-core';

import { MoreOutlined } from '@ant-design/icons';

import moment from 'moment'

import './upload-detail.scss'

import { UploadDetails, UserLogs, Uploads, CoreUsers } from '../../../../models';

const { Title, Text } = Typography;

const { Search } = Input;

export default function UploadDetailComponent({ analysisResult, ffmenu, caption, ...props }) {

        const [uploads, setUploads] = useState([]);

        const [loading, setLoading] = useState(false);

        const [downloadHistory, setDownloadHistory] = useState([])

        const [page, setPage] = useState(1);

        const [limit, setLimit] = useState(20);

        var [query, setQuery] = useState('');

        const [visible, setVisible] = useState(false);

        const { id } = props.match.params;

        var columns = [
                {
                        title: '#',
                        dataIndex: 'index',
                        render: (value, item, index) => {
                                return (page - 1) * limit + index + 1;
                        },
                },
                {
                        title: 'Nura ID',
                        key: 'id',
                        dataIndex: 'psuedonymous_nura_id'
                },
                {
                        title: 'Registration Date',
                        key: 'title',
                        render: (record) => {
                                return DateUtils.getFormattedTimeDate(record.order_date)

                        }
                },
                {
                        title: 'Consent ID',
                        key: 'No of records',
                        render: (record) => {

                                return record.consent && record.consent.id

                        }
                },
                {
                        title: 'Consent Time',
                        key: 'date',
                        render: (record) => {

                                return record.consent && DateUtils.getFormattedTimeDate(record.consent.created_at)
                        }
                },

        ]

        //extra columns for fujifilm
        if (ffmenu) {
                columns.push({
                        title: 'Last Download',
                        key: 'lastDownload',
                        render: (record) => {

                                return record.downloads && record.downloads.created_at ? DateUtils.getFormattedTimeDate(record.downloads.created_at) : null


                        }
                })
        }

        // 
        columns.push(
                {
                        title: 'Lifetime',
                        key: 'time',
                        // dataIndex: 'time',
                        render: (record) => {

                                if (record.consent && record.consent.attributes) {

                                        const attributes = JSON.parse(record.consent.attributes)


                                        return attributes.lifetime_type ? attributes.lifetime_type : attributes.lifeTime;
                                }
                        }
                },
                {
                        title: 'Items',
                        key: 'by',
                        // dataIndex: 'by',
                        render: (record) => {


                                if (record.consent && record.consent.attributes) {
                                        const attributes = JSON.parse(record.consent.attributes)

                                        return (
                                                <>
                                                        {JSON.parse(record.consent.attributes).items === 'none' ? <Tag color='red'>Consent Updated</Tag> : null}
                                                        <p>{attributes.items}</p>
                                                </>

                                        );
                                }
                        }
                },
                {
                        title: 'Action',
                        key: 'action',
                        render: (record) => {

                                function toConsentHistory() {

                                        Location.navigate({
                                                url: `/checkup-list/update-consent/${record.psuedonymous_nura_id}`,
                                        });
                                }

                                var updated = false

                                if (record.consent && record.consent.attributes) {
                                        const attributes = JSON.parse(record.consent.attributes)
                                        if (attributes.items === 'none')
                                                updated = true
                                }
                                return (
                                        <div>
                                                <div style={{ display: 'flex' }}>
                                                        {updated ? null : <Button onClick={(e) => download(e, record)}>Download</Button>}

                                                        {
                                                                ffmenu
                                                                        ?

                                                                        <Dropdown overlay={() => {
                                                                                return menu(record)
                                                                        }} placement="bottomLeft">
                                                                                {/* <Button size="small"> */}
                                                                                <MoreOutlined />
                                                                                {/* </Button> */}
                                                                        </Dropdown>
                                                                        :
                                                                        <Button onClick={toConsentHistory}>
                                                                                Consent History
                                                                        </Button>
                                                        }
                                                </div>

                                        </div>
                                )
                        },
                },
        )

        //For analysis Result
        if (analysisResult) {
                columns = [
                        {
                                title: '#',
                                dataIndex: 'index',
                                render: (value, item, index) => {
                                        return (page - 1) * limit + index + 1;
                                },
                        },
                        {
                                title: 'Nura ID',
                                key: 'id',
                                dataIndex: 'psuedonymous_nura_id'
                        },

                        {
                                title: 'Data ID',
                                key: 'data_id',
                                render: (record) => {

                                        return record.id

                                }
                        },
                        // {
                        //         title: 'Registration Date',
                        //         key: 'title',
                        //         render: (record) => {
                        //                 return record.order_date ? DateUtils.getFormattedTimeDate(record.order_date): null

                        //         }
                        // },
                        {
                                title: 'Consent ID',
                                key: 'No of records',
                                render: (record) => {

                                        if (record.attributes) {
                                                const attributes = JSON.parse(record.attributes)

                                                return attributes.consent_id;
                                        }

                                }
                        },
                        {
                                title: 'Consent Status',
                                key: 'status',
                                dataIndex: 'status'
                        },
                        {
                                title: 'Last Download',
                                key: 'last_download',
                                render: (record) => {

                                        return record.downloads && record.downloads.created_at ? DateUtils.getFormattedTimeDate(record.downloads.created_at) : null


                                }
                        },

                        {
                                title: 'Action',
                                key: 'action',
                                render: (record) => {

                                        return (
                                                <div className='action'>

                                                        <Button onClick={(e) => download(e, record)}>Download</Button>
                                                        <Popconfirm
                                                                title="Are you sure you want to delete the record? "
                                                                onConfirm={(e) => deleteRecord(e, record)}
                                                                onCancel={() => { }}
                                                                okText="Yes"
                                                                cancelText="No"
                                                        >
                                                                <Button >Delete</Button>

                                                        </Popconfirm>
                                                        <Dropdown overlay={() => {
                                                                return menu(record)
                                                        }} placement="bottomLeft">
                                                                {/* <Button size="small"> */}
                                                                <MoreOutlined />
                                                                {/* </Button> */}
                                                        </Dropdown>


                                                </div>
                                        )
                                },
                        },

                ]
        }


        useEffect(() => {
                getData();

        }, [])

        /**
         * Function to load the data for screen
         */

        function getData() {

                setLoading(true);

                UploadDetails.getDetails(id, analysisResult).then(result => {
                        // setDetails(result.result)

                        setUploads(result);

                        setLoading(false);

                })
        }

        /**
         * function for download
         */

        function download(e, record) {

                const bulk = false

                Uploads.downloadFiles(record.id, analysisResult, bulk).then((res) => {

                        if (res.success) {

                                Uploads.download(res.content.data)
                                // Uploads.download(res.buffer.data)

                                getData()

                        } else {
                                message.error(res.message)
                        }
                })
        }

        /**
         * Function for deleting a record
         */

        async function deleteRecord(e, record) {
                const result = await UploadDetails.deleteRecord(record.id)
                if (result.success) {
                        message.success(result.message)
                        getData()
                }
                else {
                        message.error(result.message)
                }
        }


        /**
         * Menu for additional options
         */

        const menu = (record) => {

                return (<Menu onClick={(event) => {

                        handleClick(event, record);

                }}>
                        <Menu.Item key="download_history" >
                                Download History
                        </Menu.Item>

                        {/* For Analysis Result Menu */}
                        {
                                analysisResult ? null : <>

                                        <Menu.Item key="consent_history" >
                                                Consent History
                                        </Menu.Item>

                                        <Menu.Item key="result_analysis" >
                                                Result Analysis
                                        </Menu.Item>
                                </>
                        }
                        {/* For Analysis Result Menu */}

                </Menu>)

        };

        /**
         * Function to get download history
         * 
         */
        async function getDownloadHistory(record) {
                var config = {
                        queries: [{
                                field: 'type',
                                value: 'download'
                        },
                        {
                                field: 'upload_details_id',
                                value: record.id

                        }]
                }
                await UserLogs.get(config).then((result) => {
                        setDownloadHistory({
                                ...record,
                                download: result.result
                        })
                })

        }

        /**
         * 
         * @param {*} params 
         */
        async function handleClick(params, record) {

                if (params.key === 'download_history') {
                        if (analysisResult) {

                                // await getDownloadHistory(record)
                                setDownloadHistory(record)
                                setVisible(true)
                        }
                        else {
                                Location.navigate({
                                        url: `/checkup-list/downloads-history/${record.psuedonymous_nura_id}?&consentId=${record.consent.id}`,
                                });
                        }
                }

                else if (params.key === 'consent_history')

                        Location.navigate({
                                url: `/checkup-list/update-consent/${record.psuedonymous_nura_id}`,
                        });

                else if (params.key === 'result_analysis')

                        Location.navigate({
                                url: `/checkup-list/derived-analysis/${record.psuedonymous_nura_id}`,
                        });
        }



        /**
         * Function to be triggered on search
         * @param {} event 
         */

        function onSearch(event) {
                setQuery(event.target.value);
        }

        return (
                <div>

                        {
                                loading
                                        ?
                                        <Skeleton />
                                        :
                                        <>

                                                <Title level={3}>{caption}</Title>
                                                <Card>
                                                        <Title level={4}>
                                                                {uploads.title}
                                                        </Title>
                                                        <div className='detail-header'>
                                                                <p>ID :{uploads.id}</p>
                                                                {/* <Search
                                                                        placeholder="Enter Search Value"
                                                                        allowClear
                                                                        style={{ width: '25%', marginTop: '10px', marginBottom: '20px' }}
                                                                        onChange={onSearch}
                                                                /> */}
                                                        </div>
                                                        <Table
                                                                scroll={{ x: true }}
                                                                //  rowKey={(record) => record.da_id}
                                                                dataSource={uploads.upload_details}
                                                                columns={columns}
                                                        // pagination={{
                                                        //         current: page,
                                                        //         onChange(current) {
                                                        //                 setPage(current);
                                                        //         },
                                                        // }}
                                                        />
                                                </Card>

                                                {/**
                                                * Modal for Download History
                                                */}
                                                <Modal
                                                        destroyOnClose={true}
                                                        footer={null}
                                                        title="Download History"
                                                        visible={visible}
                                                        okText="Okay"
                                                        onOk={() => {
                                                                setVisible(false);
                                                        }}
                                                        onCancel={() => {
                                                                setVisible(false);
                                                        }}
                                                >
                                                        <DownloadHistory data={downloadHistory} />

                                                </Modal>

                                                {/**
                                                * Modal for Download History ends
                                                */}

                                        </>}

                </div>


        )
}

function DownloadHistory({ data }) {

        const [page, setPage] = useState(1);

        const [limit, setLimit] = useState(20);


        const [downloadHistory, setDownloadHistory] = useState([])


        /**
         * Function to get download history
         */

        async function getData() {

                var config = {
                        queries: [{
                                field: 'type',
                                value: 'download'
                        },
                        {
                                field: 'psuedonymous_nura_id',
                                value: data.psuedonymous_nura_id

                        }],
                        // baseUrl: process.env.REACT_APP_FF
                }
                var result = await UserLogs.get(config)
                Promise.all(result.result.map(async (ele, key) => {
                        var id = ele.created_by
                        var user = await CoreUsers.get()
                        user = user.result.filter((user) => user.id === id)

                        return {
                                ...ele,
                                created_by_details: user[0]
                        }
                })).then((arr) => {

                        setDownloadHistory(arr)
                        //   setLoading(false)
                })

        }

        useEffect(() => {
                getData()
        }, [])


        const columns = [
                {
                        title: '#',
                        dataIndex: 'index',
                        render: (value, item, index) => {
                                return (page - 1) * limit + index + 1;
                        },
                },
                {
                        title: 'Last Download',
                        key: 'last_download',
                        render: (record) => {

                                return moment(record.created_at).format('DD/MM/YYYY')

                        }
                },
        ]

        return (
                <div>
                        <p>Nura ID :</p>
                        <p>{data.psuedonymous_nura_id}</p>
                        {/* <p>Data   ID</p> */}
                        <p></p>
                        <Table
                                scroll={{ x: true }}
                                //  rowKey={(record) => record.da_id}
                                dataSource={downloadHistory}
                                columns={columns}
                        // pagination={{
                        //     current: page,
                        //     onChange(current) {
                        //         setPage(current);
                        //     },
                        // }}
                        />
                </div>

        )
}