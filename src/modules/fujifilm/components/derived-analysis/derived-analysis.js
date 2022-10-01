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

import { Table, Button, Typography, Dropdown, Menu } from 'antd';

import { Location, Card } from '@soxo/bootstrap-core';

import './derived-analysis.scss';

import ConsentDetails from '../consent-details/consent-details';

import { MoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DerivedAnalysis() {
          const [derivedAnalysis, setDerivedAnalysis] = useState([{
                    id: '',
                    title: '',
                    Number: '',
                    date: '',
                    time: '',
                    by: ''
          }])

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
                              dataIndex: 'date'
                    },
                    {
                              title: 'Upload User',
                              key: 'user',
                              dataIndex: 'user'
                    },



          ]

          //Extra columns for fujifilm
          if (ffmenu) {
                    columns.push({
                              title: 'Last Download',
                              key: 'lastDownload',
                              dataIndex: 'lastDownload'
                    },)
          }

          columns.push(
                    {
                              title: 'Action',
                              key: 'action',
                              render: (ele) => {

                                        return (
                                                  <div>
                                                            <div style={{ display: 'flex' }}>
                                                                      <Button onClick={download}>Download</Button>


                                                                      {ffmenu ?

                                                                                <Dropdown overlay={menu} placement="bottomLeft">

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
          function download() {

          }


          /**
           * Open menu with additional options
           */
          const menu = (
                    <Menu onClick={handleClick}>
                              <Menu.Item key="download_history" >
                                        Download History
                              </Menu.Item>

                              <Menu.Item key="result_analysis" >
                                        Result Analysis
                              </Menu.Item>
                    </Menu>
          );

          

          function handleClick(params) {
                    if (params.key === 'download_history')
                              Location.navigate({
                                        url: `/checkup-list/downloads-history`,
                              });

                    else if (params.key === 'result_analysis') {

                    }
          }


          return (
                    <div>

                              <Title level={3}>DERIVED ANALYSIS RESULT </Title>

                              <div className='derived-analysis'>
                                        <div>
                                                  <Title level={5}> Nura ID</Title>
                                                  <p>NURA45</p>
                                        </div>
                                        <div className='details'>
                                                  <p>Consent ID: 2541252</p>
                                                  <p>Registration Date:26/02/2022</p>
                                        </div>

                              </div>
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
                                        <Card className={'details'}><ConsentDetails /></Card>
                              </div>

                    </div>


          )
}

