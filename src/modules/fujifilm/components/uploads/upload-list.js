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

import { Table, Button, Typography, Modal, Upload, message, Input, Dropdown, Menu, Skeleton } from 'antd';

import { Location, ReferenceSelect, InputComponent, FileUpload, Users } from 'sx-bootstrap-core';

import { UploadOutlined, MoreOutlined } from '@ant-design/icons';

import * as XLSX from 'xlsx/xlsx.mjs';

import moment from 'moment'

import './upload-list.scss';
import { CoreUsers, Uploads, UserLogs } from '../../../../models';

const { Title, Text } = Typography;

export default function UploadList({ ffmenu, analysisResult, mode }) {
     const [checkUpData, setCheckUpData] = useState([])

     const [page, setPage] = useState(1);

     const [limit, setLimit] = useState(20);

     const [visible, setVisible] = useState(false);

     const [uploadVisible, setUploadVisible] = useState(false);

     const [files, setFiles] = useState([]);

     const [loading, setLoading] = useState(true);

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
               dataIndex: 'number_of_records'
          },
          {
               title: 'Upload Date',
               key: 'date',
               render: (record) => {
                    return (
                         <span>
                              {record && record.created_at ? moment(record.created_at).format('DD/MM/YYYY') : null}
                         </span>
                    );
               },
          },
          {
               title: 'Upload Time',
               key: 'time',
               render: (record) => {
                    return (
                         <span>
                              {record && record.created_at ? moment(record.created_at).format(' hh:mm A') : null}
                         </span>
                    );
               },
          },
          {
               title: 'Uploaded By',
               key: 'by',
               render: (record) => {
     
                    return (
                         <span>
                              {record && record.created_by ? record.created_by_details['name'] : null}
                         </span>
                    );
               },
          },



     ]

     //Additional columns for fujifilm
     if (ffmenu) {
          columns.push(
               {

                    title: 'Consent Status',
                    key: 'status',
                    dataIndex: 'status'

               },
               {
                    title: 'Last Download',
                    key: 'lastDownload',
                    dataIndex: 'lastDownload'
               },)
     }

     columns.push({
          title: 'Action',
          key: 'action',
          render: (ele) => {
               function toUpdate() {

                    Location.navigate({
                         url: `/checkup-list/details/${ele.id}`,
                    });

               }

               function toDownload() {
                    var formBody = {
                         mode: mode,
                         type: 'download',
                         upload_details_id: ele.id,
                         uuid: ele.uuid,
                         hash: ele.hash,
                         pseudonymous_nura_id: ele.pseudonymous_nura_id,
                         order_date: ele.order_date,
                         file_path: ele.file_path,
                         upload_id: ele.upload_id

                    }
                    UserLogs.add(formBody)
               }

               return (
                    analysisResult ?
                         <div style={{ display: 'flex' }}>
                              <Button onClick={toUpdate}>Delete</Button>
                              <Button onClick={toDownload}>Download</Button>
                              <Dropdown overlay={() => {
                                   return menu(ele)
                              }} placement="bottomLeft">

                                   <MoreOutlined />

                              </Dropdown>
                         </div> :
                         <div style={{ display: 'flex' }}>
                              <Button onClick={toUpdate}>Details</Button>
                              <Button onClick={toDownload}>Download</Button>
                              {ffmenu ? null : <Button onClick={modalVisible}>Update Consent</Button>}
                         </div>

               )
          },
     },)

     useEffect(() => {
          getData();
          getAnalysisResult();
     }, [])


     /**
      * Get Upload Data from Uploads table, then load user from core_users for each upload records
      */
     async function getData() {


          const queries = [{
               field: 'mode',
               value: mode
          }]

          var config = {
               queries,
          }
          var result = await Uploads.get(config)

          Promise.all(result.result.map(async (ele, key) => {
               var id = ele.created_by
               var user = await CoreUsers.getRecord({ id })
               return {
                    ...ele,
                    created_by_details: user.result
               }
          })).then((arr) => {
               console.log(arr)
               setCheckUpData(arr)
               setLoading(false)
          })

     }

     /**
      * get upload records along with upload details with  the same id
      * @param {*} id 
      */
     function getAnalysisResult(id = 16) {
          var config = {
               queries: [{
                    field: 'id',
                    value: id
               }

               ],
               includes: 'upload_details'
          }

          Uploads.get(config).then((res) => {
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
                    <Menu.Item key="analysis_details" >
                         Analysis Details
                    </Menu.Item>


               </Menu>
          )
     }



     function handleClick(params,record) {
          if (params.key === 'analysis_details')
               Location.navigate({
                    url: `/analysis-result-details/${record.id}`,
               });
     }
     var analysisColumns = []


     /**
      * columns for analysis result menu
      */
     if (analysisResult) {
          columns.forEach((ele) => {

               if (ele.dataIndex !== 'status') {
                    analysisColumns.push(ele)
               }
          })
     }

     /**
      * Set Modal visible for update consent
      */

     function modalVisible() {
          setVisible(true)
     }

     const SheetJSFT = [
          'xlsx',
          'xlsb',
          'xlsm',
          'xls',
          'xml',
          'csv',
          'txt',
          'ods',
          'fods',
          'uos',
          'sylk',
          'dif',
          'dbf',
          'prn',
          'qpw',
          '123',
          'wb*',
          'wq*',
          'html',
          'htm',
     ]

     const uploadProps = {
          onRemove: (file) => {
               var index = files.indexOf(file);

               var newFileList = files.slice();

               newFileList.splice(index, 1);

               setFiles({ ...newFileList });
          },
          onChange(info) {

               console.log('File Added');

               if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);

                    // setBtnloading(true);

                    handleFile(info.file);
               }
               if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
               } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
               }
          },
          beforeUpload: (file) => {

               // setBtnloading(true);

               setFiles([...files, file]);

               return false;
          },
          files,
     };

     // Variable to show indicator for loading
     let hide = null;


     /**
*
* @param {*} document
*/
     function handleFile(document) {

          // Removed
          if (document.status !== 'removed') {
               var f = document;

               var reader = new FileReader();

               const rABS = !!reader.readAsBinaryString;

               reader.onload = function (e) {

                    // 
                    hide = message.loading('Comparing data , Please wait');

                    const bstr = e.target.result;

                    const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });

                    const wsname = wb.SheetNames[0];

                    const ws = wb.Sheets[wsname];

                    const data = XLSX.utils.sheet_to_json(ws, { header: 0 });

                    console.log('Data Retreived');

                    //         retrieveData(data);

               };

               if (rABS) reader.readAsBinaryString(f);
               else reader.readAsArrayBuffer(f);
          } else {
               setFiles([]);

               // setBtnloading(false);

          }
     }


     function uploadModal() {
          setUploadVisible(true)
     }

     return (
          <div>

               {analysisResult ? <Title level={3}>ANALYSIS RESULTS DATA</Title> : <Title level={3}>CHECK UP DATA</Title>}


               {!analysisResult && ffmenu ? null :

                    <div className='upload-list'>


                         <Button onClick={uploadModal}>
                              Upload
                         </Button>

                    </div>}
               {loading ? <Skeleton /> :
                    (analysisResult ?
                         <Table
                              scroll={{ x: true }}
                              //  rowKey={(record) => record.da_id}
                              dataSource={checkUpData}
                              columns={analysisColumns}
                         // pagination={{
                         //     current: page,
                         //     onChange(current) {
                         //         setPage(current);
                         //     },
                         // }}
                         /> :
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
                         />)}

               <Modal
                    destroyOnClose={true}
                    footer={null}
                    title="Upload Consent"
                    visible={uploadVisible}
                    okText="Okay"
                    onOk={() => {
                         setUploadVisible(false);
                    }}
                    onCancel={() => {
                         setUploadVisible(false);
                    }}
               >
                    <UploadConsent analysisResult={analysisResult} />
               </Modal>

               <Modal
                    destroyOnClose={true}
                    footer={null}
                    title="Update Consent"
                    visible={visible}
                    okText="Okay"
                    onOk={() => {
                         setVisible(false);
                    }}
                    onCancel={() => {
                         setVisible(false);
                    }}
               >
                    <UpdateConsent SheetJSFT={SheetJSFT} uploadProps={uploadProps} files={files} />
               </Modal>
          </div>


     )
}


function UploadConsent({ analysisResult }) {

     const [checkupFile, setCheckUpFile] = useState([])

     function submit() {
          Uploads.addFile(checkupFile)
     }
     return (
          <div>
               <Title level={5}>Title</Title>
               <Input></Input>
               {analysisResult ?
                    <div>
                         <Title level={5}>Analysis Result</Title>

                         <FileUpload >
                              <Button size={'small'} icon={<UploadOutlined />}>
                                   Upload
                              </Button>
                         </FileUpload>
                    </div> :
                    <>

                         <div>

                              <Title level={5}>Consent Data</Title>

                              <FileUpload setCheckUpFile={setCheckUpFile} mode='data'>
                                   <Button size={'small'} icon={<UploadOutlined />}>
                                        Upload
                                   </Button>
                              </FileUpload>


                         </div>

                         <div>
                              <Title level={5}>Psuedonymized Data</Title>

                              <FileUpload>
                                   <Button size={'small'} icon={<UploadOutlined />}>
                                        Upload
                                   </Button>
                              </FileUpload>
                         </div>
                         <Button onClick={submit}>submit</Button>

                    </>

               }

          </div>


     )
}

/**
 * Component for uploading consent
 * @param {*} SheetJSFT 
 * @param {*} uploadProps 
 * @param {*} files 
 * @returns 
 */

function UpdateConsent() {

     function approveUpload() {

     }

     function cancelUpload() {

     }


     return (
          <div>
               <div>
                    <FileUpload>
                         <Button size={'small'} icon={<UploadOutlined />}>
                              Choose File
                         </Button>
                    </FileUpload>
               </div>

               <div className='upload-consent'>
                    <Button onClick={approveUpload}>Approve</Button>
                    <Button onClick={cancelUpload}>Cancel</Button>
               </div>
          </div>
     )
}