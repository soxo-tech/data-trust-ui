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

import { Table, Button, Typography, Input, Dropdown, Menu } from 'antd';

import { Location, ReferenceSelect, InputComponent, Card } from '@soxo/bootstrap-core';

import { MoreOutlined } from '@ant-design/icons';

import './upload-detail.scss'


const { Title, Text } = Typography;

const { Search } = Input;



export default function UploadDetails() {
        const [details, setDetails] = useState([
                {
                        id: '',
                        title: '',
                        Number: '',
                        date: '',
                        time: '',
                        by: ''
                }
        ])

        const [page, setPage] = useState(1);

        const [limit, setLimit] = useState(20);

        var [query, setQuery] = useState('');

        //ffmenu is maintaine to determine which user is using(nura or fujifilm)
        const [ffmenu, setFFmenu] = useState(false)

        const columns = [
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
                        dataIndex: 'id'
                },
                {
                        title: 'Registration Date',
                        key: 'title',
                        dataIndex: 'title'
                },
                {
                        title: 'Consent ID',
                        key: 'No of records',
                        dataIndex: 'Number'
                },
                {
                        title: 'Consent Time',
                        key: 'date',
                        dataIndex: 'date'
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

        columns.push({
                title: 'Lifetime',
                key: 'time',
                dataIndex: 'time'
        },
                {
                        title: 'Items',
                        key: 'by',
                        dataIndex: 'by'
                },
                {
                        title: 'Action',
                        key: 'action',
                        render: (ele) => {



                                function toConsentHistory() {

                                        Location.navigate({
                                                url: `/checkup-list/update-consent`,
                                        });

                                }
                                return (
                                        <div>

                                                <Button onClick={download}>Download</Button>
                                                {ffmenu ?
                                                        <Dropdown overlay={menu} placement="bottomLeft">
                                                                {/* <Button size="small"> */}
                                                                        <MoreOutlined />
                                                                {/* </Button> */}
                                                        </Dropdown> : <Button onClick={toConsentHistory}> Consent History</Button>}

                                             
                                        </div>
                                )
                        },
                },
        )


        /**
         * function for download
         */
        function download() {

        }


        /**
         * Menu for additional options
         */
        const menu = (
                <Menu onClick={handleClick}>
                        <Menu.Item key="download_history" >
                                Download History
                        </Menu.Item>

                        <Menu.Item key="consent_history" >
                                Consent History
                        </Menu.Item>

                        <Menu.Item key="result_analysis" >
                                Result Analysis
                        </Menu.Item>
                </Menu>
        );

        function handleClick(params) {
                if(params.key==='download_history')
                Location.navigate({
                        url: `/checkup-list/downloads-history`,
                });
                else if(params.key==='consent_history')
                Location.navigate({
                        url: `/checkup-list/update-consent`,
                });
                else if(params.key==='result_analysis')
                Location.navigate({
                        url: `/checkup-list/derived_analysis`,
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
                        <Title level={3}>PSUEDONYMIZED DATA</Title>
                        <Card>
                                <Title level={4}>
                                        May 2022 Examinees
                                </Title>
                                <div className='detail-header'>
                                        <p>ID :100910</p>
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
                                        dataSource={details}
                                        columns={columns}
                                // pagination={{
                                //     current: page,
                                //     onChange(current) {
                                //         setPage(current);
                                //     },
                                // }}
                                />
                        </Card>
                </div>


        )
}