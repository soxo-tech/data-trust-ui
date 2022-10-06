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

import { Table, Button, Typography, Modal, Upload, message, Input, Dropdown, Menu } from 'antd';

import { Location, ReferenceSelect, InputComponent, FileUpload } from '@soxo/bootstrap-core';

import { UploadOutlined, MoreOutlined } from '@ant-design/icons';

import * as XLSX from 'xlsx/xlsx.mjs';

import './upload-list.scss';
import { Uploads } from '../../../../models';

const { Title, Text } = Typography;

export default function UploadList({ ffmenu, analysisResult, mode }) {
     const [checkUpData, setCheckUpData] = useState([{
          id: '',
          title: '',
          Number: '',
          date: '',
          time: '',
          by: '',
          status: '',
          lastDownload: ''
     }])

     const [page, setPage] = useState(1);

     const [limit, setLimit] = useState(20);

     const [visible, setVisible] = useState(false);

     const [uploadVisible, setUploadVisible] = useState(false);

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

               return (
                    analysisResult ?
                         <div style={{ display: 'flex' }}>
                              <Button onClick={toUpdate}>Delete</Button>
                              <Button onClick={Download}>Download</Button>
                              <Dropdown overlay={menu} placement="bottomLeft">

                                   <MoreOutlined />

                              </Dropdown>
                         </div> :
                         <div style={{ display: 'flex' }}>
                              <Button onClick={toUpdate}>Details</Button>
                              <Button onClick={Download}>Download</Button>
                              {ffmenu ? null : <Button onClick={modalVisible}>Update Consent</Button>}
                         </div>

               )
          },
     },)

     useEffect(() => {
          getData();
          getAnalysisResult();
     }, [])

     function getData() {


          const queries = [{
               field: 'mode',
               value: mode
          }]

          var config = {
               queries
          }
          Uploads.get(config).then(result => {
               setCheckUpData(result.result)
          })
     }

     function getAnalysisResult(id=16){
         
          Uploads.getRecord({id}).then((res)=>{
               console.log(res)
          })
     }

     /**
      * Open menu with additional options
      */
     const menu = (
          <Menu onClick={handleClick}>
               <Menu.Item key="analysis_details" >
                    Analysis Details
               </Menu.Item>


          </Menu>
     );

     function handleClick(params) {
          if (params.key === 'analysis_details')
               Location.navigate({
                    url: `/analysis-result-details`,
               });
     }
     var analysisColumns = []

     if (analysisResult) {
          columns.forEach((ele) => {

               if (ele.dataIndex !== 'status') {
                    analysisColumns.push(ele)
               }
          })
     }

     console.log(analysisColumns)

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
     /**
      * Function to download
      */

     function Download() {

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
               {analysisResult ?
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
                    />}

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
     return (
          <div>
               <Title level={5}>Title</Title>
               <Input></Input>
               {analysisResult ?
                    <div>
                         <Title level={5}>Analysis Result</Title>

                         <FileUpload>
                              <Button size={'small'} icon={<UploadOutlined />}>
                                   Upload
                              </Button>
                         </FileUpload>
                    </div> :
                    <>

                         <div>

                              <Title level={5}>Consent Data</Title>

                              <FileUpload>
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