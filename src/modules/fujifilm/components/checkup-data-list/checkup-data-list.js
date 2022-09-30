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

import { Table, Button ,Typography} from 'antd';

// import { Location, ReferenceSelect, InputComponent } from '@soxo/bootstrap-core';


import moment from 'moment';

import { EditOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;




export default function CheckUpDataList() {
          const [checkUpData, setCheckUpData] = useState([])

          const [page, setPage] = useState(1);

          const [limit, setLimit] = useState(20);

          const columns = [
                    {
                              title: '#',
                              dataIndex: 'index',
                              render: (value, item, index) => {
                                        return (page - 1) * limit + index + 1;
                              },
                    },
                    {
                              title: 'ID',
                              key: 'id',
                              dataIndex: 'id'
                    },
                    {
                              title: 'Title',
                              key: 'title',
                              dataIndex: 'title'
                    },
                    {
                              title: 'Number of Records',
                              key: 'No of records',
                              dataIndex: 'Number'
                    },
                    {
                              title: 'Upload Date',
                              key: 'date',
                              dataIndex: 'date'
                    },
                    {
                              title: 'Upload Time',
                              key: 'time',
                              dataIndex: 'time'
                    },
                    {
                              title: 'Uploaded By',
                              key: 'by',
                              dataIndex: 'by'
                    },
                    {
                              title: 'Action',
                              key: 'action',
                              render: (ele) => {
                                        return (
                                                  <div>
                                                            <Button>Details</Button>
                                                            <Button>Download</Button>
                                                            <Button>Update Consent</Button>
                                                  </div>
                                        )
                              },
                    },

          ]

          return (
                    <div>
                    <Title  level={3}>CHECK UP DATA</Title>
                    <Table
                              scroll={{ x: true }}
                              //  rowKey={(record) => record.da_id}
                              dataSource={checkUpData}
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