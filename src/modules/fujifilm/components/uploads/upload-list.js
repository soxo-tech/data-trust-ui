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

import { Location, ReferenceSelect, InputComponent, FileUpload, Users } from 'soxx-bootstrap-core';

import { UploadOutlined, MoreOutlined } from '@ant-design/icons';

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

     const [checkupFile, setCheckUpFile] = useState([])

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



     function handleClick(params, record) {
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
                    <UploadConsent analysisResult={analysisResult} setVisible={setUploadVisible}  getData={getData}/>
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
                    <UpdateConsent files={files} />
               </Modal>
          </div>


     )
}

/**
 * Function to upload consent and checkup files
 * @param {*} param0 
 * @returns 
 */
function UploadConsent({ analysisResult, setVisible,getData}) {

     const [consentFile, setConsentFile] = useState({})

     const [psuedonymizedFile, setPsuedonymizedFile] = useState({})

     const [analysisFile, setAnalysisFile] = useState({})

     const [title, setTitle] = useState()

     const [loading, setLoading] = useState(false)

     //Onsumbit of the modal, both files with title is send to backend
     async function submit() {
          setLoading(true)
          const data = new FormData();

          if (analysisResult) {
               data.append('analysisFile', analysisFile)
               data.append('title', title)
          }
          else {

               data.append("consentFile", consentFile);
               data.append("psuedonymizedFile", psuedonymizedFile);
               data.append("title", title);
          }
          // let file = {
          //      consentFile: consentFile,
          //      psuedonymizedFile: psuedonymizedFile,
          //      title: title
          // }
          Uploads.uploadFileContent(data, analysisResult).then((result) => {
               if (result.success) {
                    message.success(result.message)
                    setVisible(false)
               }
               else {
                    message.error(result.message)
               }
               // setVisible(false)
               getData()
               setLoading(false)

          })

     }


     //Function when uploading consent file
     function handleConsentFile(e) {
          console.log(e.target.files)
          let files = e.target.files[0]
          setConsentFile(files)
     }

     function handleAnalysisFile(e) {
          console.log(e.target.files)
          let files = e.target.files[0]
          setAnalysisFile(files)
     }

     //Function when uploading psuedonymized file
     function handlePsuedonymizedFile(e) {
          console.log(e.target.files)
          let files = e.target.files[0]
          setPsuedonymizedFile(files)
     }

     //Function for onChange of Title
     function handleTitle(e) {
          setTitle(e.target.value)
     }
     return (

          <div>
               <Title level={5}>Title</Title>
               <Input onChange={handleTitle}></Input>

               {analysisResult ?
                    <div>
                         <br />
                         <Title level={5}>Analysis Result</Title>

                         <label>
                              Select File
                         </label>
                         <br />

                         <input type='file' name='consentFile' onChange={(e) => handleAnalysisFile(e)} />
                         <br />
                         <br />
                    </div> :
                    <>

                         <div>



                              <form id='myform'>
                                   <br />
                                   <Title level={5}>Consent Data</Title>
                                   <label>
                                        Select File
                                   </label>
                                   <br />

                                   <input type='file' name='consentFile' onChange={(e) => handleConsentFile(e)} />
                                   <br />
                                   <br />
                                   <Title level={5}>Psuedonymized Data</Title>

                                   <label>
                                        Select File
                                   </label>
                                   <br />

                                   <input type='file' name='psuedonymizedFile' onChange={(e) => handlePsuedonymizedFile(e)} />
                                   <br />
                                   <br />
                              </form>


                         </div>

                         <div>

                         </div>
                         <br />

                    </>

               }
               <Button loading={loading} onClick={submit} >Submit</Button>

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