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

import { Table, Button, Typography, Modal, Upload, message } from 'antd';

import { Location, ReferenceSelect, InputComponent, Card } from 'sx-bootstrap-core';

import ConsentDetails from '../consent-details/consent-details';

const { Title, Text } = Typography;

export default function DownloadHistory() {
          const [downloadHistory, setDownloadHistory] = useState([{
                    user: '',
                    last: '',
                    discarded: '',


          }])

          const [page, setPage] = useState(1);

          const [limit, setLimit] = useState(20);

          //ffmenu is maintaine to determine which user is using(nura or fujifilm)
          const [ffmenu, setFFmenu] = useState(false)

          var columns = []

          //Columns for fujifilm

          if (ffmenu) {


                    columns = [
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
                                        dataIndex: 'id'
                              },
                              {
                                        title: 'Consent Time',
                                        key: 'time',
                                        dataIndex: 'time'
                              },
                              {
                                        title: 'Last Download',
                                        key: 'last',
                                        dataIndex: 'last'
                              },
                              {
                                        title: 'Lifetime',
                                        key: 'lifetime',
                                        dataIndex: 'lifetime'
                              },
                              {
                                        title: 'Items',
                                        key: 'items',
                                        dataIndex: 'items'
                              },

                    ]

          }
          //Columns for Nura
          else {

                    columns = [
                              {
                                        title: '#',
                                        dataIndex: 'index',
                                        render: (value, item, index) => {
                                                  return (page - 1) * limit + index + 1;
                                        },
                              },
                              {
                                        title: 'Downloaded User',
                                        key: 'user',
                                        dataIndex: 'user'
                              },
                              {
                                        title: 'Last Download',
                                        key: 'last',
                                        dataIndex: 'last'
                              },
                              {
                                        title: 'Discarded Date',
                                        key: 'discarded',
                                        dataIndex: 'discarded'
                              },

                    ]
          }



          return (

                    <div className='consent-history'>

                              <Card className={'history'}>


                                        <div className='history-table'>
                                                  <div>
                                                            <Title level={5}>Nura ID</Title>
                                                            <p>REGISTRATION NUMBER</p>
                                                  </div>
                                                  <div>
                                                            <Title level={5}>Registration Date</Title>
                                                            <p>23/03/2022</p>
                                                  </div>
                                                  <div>
                                                            <Title level={5}>Consent ID</Title>
                                                            <p>2500</p>
                                                  </div>
                                                  <div>
                                                            <Title level={5}>Consent Status</Title>
                                                            <p>Updated</p>
                                                  </div>


                                        </div>

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
                              </Card>
                              {ffmenu ? null :
                                        <Card className={'details'}>
                                                  <ConsentDetails />
                                        </Card>}


                    </div>


          )
}

