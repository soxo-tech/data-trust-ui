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

 import { Table, Button, Typography } from 'antd';
 
 import { Location, ReferenceSelect, InputComponent } from '@soxo/bootstrap-core';
 
 
 import moment from 'moment';
 
 import { EditOutlined, CloseOutlined } from '@ant-design/icons';
 
 const { Title, Text } = Typography;
 
 
 
 
 export default function UploadDetails() {
           const [details, setDetails] = useState([
                   { id:'',
          title:'',
          Number:'',
          date:'',
          time:'',
          by:''
}
           ])
 
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
                     {
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
                                                             <Button onClick={toConsentHistory}> Consent History</Button>
                                                   </div>
                                         )
                               },
                     },
 
           ]

           
           function download(){

           }
 
           return (
                     <div>
                               <Title level={3}>PSUEDONYMIZED DATA</Title>
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
                     </div>
 
 
           )
 }