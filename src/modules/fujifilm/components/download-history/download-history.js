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

import { Table, Button, Typography, Modal, Upload, message, Skeleton } from 'antd';

import { Location, ReferenceSelect, InputComponent, Card } from 'soxo-bootstrap-core';

import ConsentDetails from '../consent-details/consent-details';
import { UserLogs, CoreUsers } from '../../../../models';

const { Title, Text } = Typography;

export default function DownloadHistory({ ...props }) {
     
     const [downloadHistory, setDownloadHistory] = useState([])

     const [page, setPage] = useState(1);

     const [limit, setLimit] = useState(20);

     //ffmenu is maintaine to determine which user is using(nura or fujifilm)
     const [ffmenu, setFFmenu] = useState(false)

     const [loading, setLoading] = useState(true)

     const { id } = props.match.params;



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
                    render: (record) => {

                         return record.created_by_details['name']

                    }
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

     useEffect(() => {
          getData();

     }, [])

     /**
* Function to load the data for screen
*/
     async function getData() {
          var config = {
               queries: [{
                    field: 'type',
                    value: 'download'
               },
               {
                    field: 'psuedonymous_nura_id',
                    value: id

               }],
               //Get download histtory of checkup from nura db
               baseUrl: process.env.REACT_APP_NURA
          }


          var result = await UserLogs.get(config)
          Promise.all(result.result.map(async (ele, key) => {
               var id = ele.created_by
               var user = await CoreUsers.getRecord({ id })
               return {
                    ...ele,
                    created_by_details: user.result
               }
          })).then((arr) => {
               console.log(arr)
               setDownloadHistory(arr)
               setLoading(false)
          })

     }



     return (

          <div className='consent-history'>
               {loading ? <Skeleton /> : <>

                    <Card className={'history'}>


                         <div className='history-table'>
                              <div>
                                   <Title level={5}>Nura ID</Title>
                                   <p>{downloadHistory[0] && downloadHistory[0].pseudonymous_nura_id ? downloadHistory[0].pseudonymous_nura_id : id}</p>
                              </div>
                              <div>
                                   <Title level={5}>Registration Date</Title>
                                   <p>{downloadHistory[0] && downloadHistory[0].order_date ? downloadHistory[0].order_date : null}</p>
                              </div>
                              <div>
                                   <Title level={5}>Consent ID</Title>
                                   <p>{downloadHistory[0] && downloadHistory[0].upload_details_id ? downloadHistory[0].upload_details_id : null}</p>
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
                    {/* {ffmenu ? null :
                                                  <Card className={'details'}>
                                                            <ConsentDetails />
                                                  </Card>} */}

               </>}
          </div>


     )
}

