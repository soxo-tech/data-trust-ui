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

import { Table, Button, Typography, Input, Dropdown, Menu, Modal, Skeleton } from 'antd';

import { Location, ReferenceSelect, InputComponent, Card } from 'soxo-bootstrap-core';

import { MoreOutlined } from '@ant-design/icons';

import moment from 'moment'

import './upload-detail.scss'

import { UploadDetails, UserLogs } from '../../../../models';


const { Title, Text } = Typography;

const { Search } = Input;

export default function UploadDetailComponent({ analysisResult, ffmenu, caption, ...props }) {

        const [uploads, setUploads] = useState({});

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
                                return moment(record.order_date).format('DD/MM/YYYY')

                        }
                },
                {
                        title: 'Consent ID',
                        key: 'No of records',
                        // dataIndex: 'Number',
                        render: (record) => {
                                return record.id

                        }
                },
                {
                        title: 'Consent Time',
                        key: 'date',
                        // dataIndex: 'date',
                        render: (record) => {

                                return moment(record.created_at).format('DD/MM/YYYY hh:mm A')

                        }
                },

        ]

        //extra columns for fujifilm
        if (ffmenu) {
                columns.push({
                        title: 'Last Download',
                        key: 'lastDownload',
                        dataIndex: 'lastDownload'
                })
        }

        // 
        columns.push({
                title: 'Lifetime',
                key: 'time',
                // dataIndex: 'time',
                render: (record) => {

                        if (record.attributes) {

                                const attributes = JSON.parse(record.attributes)

                                return attributes.lifetime_type;
                        }
                }
        },
                {
                        title: 'Items',
                        key: 'by',
                        // dataIndex: 'by',
                        render: (record) => {


                                if (record.attributes) {
                                        const attributes = JSON.parse(record.attributes)

                                        return attributes.items;
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

                                return (
                                        <div>
                                                <div style={{ display: 'flex' }}>
                                                        <Button onClick={download}>Download</Button>

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
                                dataIndex: 'data_id'
                        },
                        {
                                title: 'Registration Date',
                                key: 'title',
                                render: (record) => {
                                        return moment(record.order_date).format('DD/MM/YYYY')
        
                                }
                        },
                        {
                                title: 'Consent ID',
                                key: 'No of records',
                                render: (record) => {

                                        return record.id

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
                                dataIndex: 'last_download'
                        },

                        {
                                title: 'Action',
                                key: 'action',
                                render: (record) => {



                                        // function toConsentHistory() {

                                        //         Location.navigate({
                                        //                 url: `/checkup-list/update-consent/${record.psuedonymous_nura_id}`,
                                        //         });

                                        // }

                                        function toDownload() {
                                                // var formBody={
                                                // //      mode:mode,
                                                //      type:'download',
                                                //      upload_details_id:ele.id,
                                                //      uuid:ele.uuid,
                                                //      hash:ele.hash,
                                                //      pseudonymous_nura_id:ele.pseudonymous_nura_id,
                                                //      order_date:ele.order_date,
                                                //      file_path:ele.file_path,
                                                //      upload_id:ele.upload_id

                                                // }
                                                // UserLogs.add(formBody)
                                        }
                                        return (
                                                <div>

                                                        <Button onClick={download}>Download</Button>


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

                UploadDetails.getDetails(id).then(result => {
                        // setDetails(result.result)
                        console.log(result.upload_details)

                        setUploads(result);

                        setLoading(false);

                })
        }

        /**
         * function for download
         */
        function download() {

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
         * 
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

                                await getDownloadHistory(record)
                                setVisible(true)
                        }
                        else {
                                Location.navigate({
                                        url: `/checkup-list/downloads-history/${record.id}`,
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
                                                                <Search
                                                                        placeholder="Enter Search Value"
                                                                        allowClear
                                                                        style={{ width: '25%', marginTop: '10px', marginBottom: '20px' }}
                                                                        onChange={onSearch}
                                                                />
                                                        </div>
                                                        <Table
                                                                scroll={{ x: true }}
                                                                //  rowKey={(record) => record.da_id}
                                                                dataSource={uploads.upload_details}
                                                                columns={columns}
                                                        // pagination={{
                                                        //     current: page,
                                                        //     onChange(current) {
                                                        //         setPage(current);
                                                        //     },
                                                        // }}
                                                        />
                                                </Card>

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

                                        </>}

                </div>


        )
}

function DownloadHistory({ data }) {

        const [page, setPage] = useState(1);

        const [limit, setLimit] = useState(20);

        const [downloads, setDownloads] = useState([])

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
                        <p>Data   ID</p>
                        <p></p>
                        <Table
                                scroll={{ x: true }}
                                //  rowKey={(record) => record.da_id}
                                dataSource={data.download}
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