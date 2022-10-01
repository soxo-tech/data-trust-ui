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

import { Location, ReferenceSelect, InputComponent, Card } from '@soxo/bootstrap-core';

import { UploadOutlined } from '@ant-design/icons';

import * as XLSX from 'xlsx/xlsx.mjs';

import moment from 'moment';

import './consent-history.scss'

import { EditOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ConsentHistory() {
          const [consentHistory, setConsentHistory] = useState([{
                    id: '',
                    time: '',
                    lifetime: '',
                    items: '',
                  
          }])

          const [page, setPage] = useState(1);

          const [limit, setLimit] = useState(20);

          const [visible, setVisible] = useState(false);

          const [files, setFiles] = useState([]);

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
                              dataIndex: 'id'
                    },
                    {
                              title: 'Consent Time',
                              key: 'time',
                              dataIndex: 'time'
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
                 
                    {
                              title: 'Action',
                              key: 'action',
                              render: (ele) => {
                                        function toUpdate() {

                                                  Location.navigate({
                                                            url: `/checkup-list/details`,
                                                  });

                                        }

                                        return (
                                                  <div>
                                                            <Button onClick={toUpdate}>Download History</Button>

                                                            <Button onClick={toUpdate}>Analysis Result</Button>


                                                  </div>
                                        )
                              },
                    },

          ]



          return (

                    <div className='consent-history'>

                              <Card className={'history'}>
                                        <Title level={5}>Nura ID</Title>

                                        <div className='history-table'>
                                                  <p>REGISTRATION NUMBER</p>
                                                  <p> 23/06/2022</p>
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
                              <Card className={'details'}></Card>


                    </div>


          )
}

