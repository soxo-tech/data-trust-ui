/***
 *
 * Component to load all upload details, upload, download and update consent
 * @description
 * @author Sameena
 */


import React, { useState, useEffect } from 'react'

import {
    Table,
    Button,
    Typography,
    Input,
    Dropdown,
    Menu,
    Modal,
    Skeleton,
    Popconfirm,
    message,
    Tag,
    Form,
} from 'antd'

import { Location, DateUtils, RangePicker } from 'soxo-bootstrap-core'

import { MoreOutlined, ReloadOutlined } from '@ant-design/icons'

import moment from 'moment'

import { UploadDetails, UserLogs, Uploads, CoreUsers } from '../../../../models'

import ErrorBoundary from '../error';

import './single-page-ui.scss'

const { Title } = Typography

export default function MainComponent({
    analysisResult,
    ffmenu,
    caption,
    ...props
}) {
    const [downloadLoading, setDownloadLoading] = useState(false)

    const [uploads, setUploads] = useState([])

    const [loading, setLoading] = useState(false)

    const [downloadHistory, setDownloadHistory] = useState([])

    const [visible, setVisible] = useState(false)

    const [uploadVisible, setUploadVisible] = useState(false)

    const [idNo, setIdNo] = useState()

    const [summaryVisible, setSummaryVisible] = useState(false)

    const [result, setResult] = useState([])

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [selectedRows, setSelectedRow] = useState([]);

    var starttime = moment.tz().startOf('day'),
        endtime = moment.tz().endOf('day').startOf('day');

    const param = Location.search()

    //If starttime and endtime are in url
    if (param.start_time) {
        updateRange();
    }

    /**
    * Function to set range from the start and end time recieved from url
    * @returns 
    */
    function updateRange() {

        starttime = moment.tz(param.start_time, 'Asia/Calcutta').startOf('day');

        endtime = moment.tz(param.end_time, 'Asia/Calcutta').startOf('day');

        return starttime, endtime;
    }

    //Setting Range by default
    const [range, setRange] = useState([starttime, endtime]);

    const [btnLoading, setBtnLoading] = useState(false)

    const { id } = props.match.params

    var columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (value, item, index) => (page - 1) * limit + index + 1,
        },
        {
            title: 'Data ID',
            key: 'data_id',
            dataIndex: 'id',
        },
        {
            title: 'Nura ID',
            key: 'id',
            dataIndex: 'psuedonymous_nura_id',
        },

        {
            title: 'Consent ID',
            key: 'No of records',
            render: (record) => {
                return record.consent && record.consent.id
            },
        },

        {
            title: 'Upload Time',
            key: 'upload_time',
            render: (record) => {
                return record.created_at ? DateUtils.getFormattedTimeDate(record.created_at) : null
            },
        },
        {
            title: 'Consent Time',
            key: 'date',
            render: (record) => {

                return (record.consent && record.consent.consent_time ? DateUtils.getFormattedTimeDate(record.consent.consent_time) : 'Not Available')
            },
        },
    ]

    //extra columns for fujifilm
    // if (ffmenu) {
    columns.push({
        title: 'Last Download',
        key: 'lastDownload',
        render: (record) => {
            if (record.downloads && record.downloads.created_at)
                return record.downloads
                    ? DateUtils.getFormattedTimeDate(record.downloads.created_at)
                    : null
        },
    })
    // }

    //
    columns.push(
        {
            title: 'Lifetime',
            key: 'time',
            render: (record) => {
                if (record.consent && record.consent.attributes) {
                    const attributes = JSON.parse(record.consent.attributes)

                    return attributes.lifetime_type

                }
            },
        },
        {
            title: 'Items',
            key: 'by',
            render: (record) => {

                if (record.consent && record.consent.attributes) {

                    const attributes = JSON.parse(record.consent.attributes)

                    if (attributes.items === 'none') {

                        return (<><p>{attributes.items}</p><Tag color="red">Consent Updated</Tag></>)

                    } else if (attributes.items === 'all') {


                        return (
                            <>
                                <p>{attributes.items}</p>
                            </>
                        )


                    } else {


                        return (
                            <>
                                <p>{attributes.items.join(',')}</p>
                            </>
                        )


                    }

                } else {

                    return null;

                }
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => {
                function viewDetails() {

                    Location.navigate({
                        url: `/check-up-details/${record.psuedonymous_nura_id}?data_id=${record.id}&activeKey=${0}`,
                    })
                }

                var updated = false

                if (record.consent && record.consent.attributes) {
                    const attributes = JSON.parse(record.consent.attributes)
                    if (attributes.items === 'none') updated = true
                }
                return (
                    <div>
                        <div style={{ display: 'flex' }}>
                            <Button onClick={viewDetails}>
                                View
                            </Button>
                            {updated ? null : (

                                <Button
                                    loading={downloadLoading}
                                    onClick={(e) => download(e, record)}
                                >
                                    Download
                                </Button>
                            )}


                            <Button onClick={(e) => modalVisible(e, record)}>
                                Update Consent
                            </Button>
                        </div>
                    </div>
                )
            },
        },
    )

    useEffect(() => {
        getData(range)
    }, [])

    /**
     * Rows of the table are selected, those rows are stored in selectedRow
     * @param {*} keys 
     * @param {*} record 
     */
    const onSelectedChange = (keys, record) => {
        onSelectChange(keys, record);
    }

    const onSelectChange = (keys, record) => {

        setSelectedRowKeys(keys);

        setSelectedRow(record);
    };

    const rowSelection = {

        selectedRowKeys,

        onChange: onSelectedChange,
    };

    /**
     * Function to load the data for screen
     */

    function getData(range) {

        setLoading(true)

        UploadDetails.getUploadDetails(range, analysisResult).then((result) => {
            setUploads(result)

            setLoading(false)
        })
    }


    /**
     * Set Modal visible for update consent
     */

    function modalVisible(e, ele) {

        setVisible(true)

        setIdNo(ele.id)
    }


    /**
     * Function is triggered when the range piscker date is changed
     * @param {*} dt 
     */
    function updateTime(dt) {

        setRange(dt);

        Location.search({
            start_time: moment(dt[0]).format('MM/DD/YYYY'),
            end_time: moment(dt[1]).format('MM/DD/YYYY'),
        });


        getData(dt);
    }

    /**
     * Visibility of Upload Modal
     */
    function uploadModal() {
        setUploadVisible(true)
    }

    /**
     * Function to filter downloaded data
     */
    function filterData() {
        const filtered = uploads.upload_details.filter(element => {
            if (element && element.downloads && element.downloads.id) { } else
                return element.downloads
        })
        setUploads({ upload_details: filtered })

    }

    /**
 * function for download
 */

    function download(e, record) {
        const bulk = false

        setDownloadLoading(true)

        Uploads.downloadFiles(record.id, analysisResult, bulk).then((res) => {

            setDownloadLoading(false)

            if (res.success) {

                Uploads.download(res.buffer.data, analysisResult)

                getData(range)
            } else {

                message.error(res.message)
            }
        })
    }

    /**
     * Download selected files
     * @param {*} e 
     * @param {*} id 
     */
    async function downloadFiles(e, id) {

        setBtnLoading(true)

        Uploads.downloadBulk(selectedRows).then((res) => {

            if (res.success) {
                // For checkup download content is downloaded a s json for now
                Uploads.download(res.buffer.data, analysisResult)

                setBtnLoading(false)

                getData(range)

            } else {
                message.error(res.message)

                setBtnLoading(false)

            }
        })
    }

    return (
        <ErrorBoundary>
            <div className='card card-shadow checkup'>
                {loading ? (
                    <Skeleton />
                ) : (
                    <>
                        <div className="page-header">
                            <Title level={3}>Check Up Data</Title>


                            <div className="page-actions">
                                <Button onClick={(e) => getData(range)}>
                                    <ReloadOutlined />
                                </Button>
                            </div>


                        </div>

                        <div>
                            <div className='header-component'  >
                                <div className='rangepicker-component'>
                                    <RangePicker
                                        allowClear={false}
                                        inputReadOnly
                                        format={'DD/MM/YYYY'}
                                        value={range}
                                        onChange={(time) => {
                                            updateTime(time, range);
                                        }}
                                        ranges={{
                                            Today: [moment(), moment()],

                                            Yesterday: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],

                                            'This Week': [moment().startOf('week'), moment().endOf('week')],

                                            'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],

                                            'This Month': [moment().startOf('month'), moment().endOf('month')],

                                            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                        }}
                                    />


                                    <div className="padding">
                                        <Button onClick={(e) => getData(range)}>All</Button>

                                        <Button onClick={filterData}>Undownloaded</Button>

                                    </div>
                                </div>


                                <div className="padding" >
                                    <Button onClick={uploadModal}>Upload</Button>
                                    <Button onClick={downloadFiles} loading={btnLoading}>Download</Button>
                                </div>

                            </div>

                            <Table
                                scroll={{ x: true }}
                                dataSource={uploads.upload_details}
                                columns={columns}
                                pagination={{
                                    current: page,
                                    onChange(current) {
                                        setPage(current);
                                    },
                                }}
                                rowKey={(record) => record.id}
                                rowSelection={rowSelection}
                            />
                        </div>

                        {/**Modal for Data Uplaod Starts */}

                        <Modal
                            destroyOnClose={true}
                            footer={null}
                            title="Data to Upload"
                            visible={uploadVisible}
                            okText="Okay"
                            onOk={() => {
                                setUploadVisible(false)
                            }}
                            onCancel={() => {
                                setUploadVisible(false)
                            }}
                        >
                            <UploadConsent
                                analysisResult={analysisResult}
                                setVisible={setUploadVisible}
                                getData={getData}
                                range={range}
                                setSummaryVisible={setSummaryVisible}
                                setResult={setResult}
                            />
                        </Modal>
                        {/**Modal for upload data ends */}

                        {/** Modal for update of consnet starts */}
                        <Modal
                            destroyOnClose={true}
                            footer={null}
                            title="Update Consent"
                            visible={visible}
                            okText="Okay"
                            onOk={() => {
                                setVisible(false)
                            }}
                            onCancel={() => {
                                setVisible(false)
                            }}
                        >
                            <UpdateConsent
                                setVisible={setVisible}
                                id={idNo}
                                setSummaryVisible={setSummaryVisible}
                                setResult={setResult}
                            />
                        </Modal>

                        { /** Modal for update of consent ends */}

                        {/*** summary modal starts*/}

                        <Modal
                            cancelButtonProps={{ hidden: true }}
                            title="Upload Summary"
                            visible={summaryVisible}
                            okText="Okay"
                            onOk={() => {
                                setSummaryVisible(false)
                                getData(range)
                            }}
                        >
                            <Summary result={result} analysisResult={analysisResult} />
                        </Modal>

                        {/*** Summary model ends*/}

                    </>
                )}
            </div>
        </ErrorBoundary>
    )
}

/**
 * Function to upload consent and checkup files
 * @param {*} param0
 * @returns
 */
function UploadConsent({
    analysisResult,
    setVisible,
    getData,
    setSummaryVisible,
    setResult,
    range
}) {
    const [consentFile, setConsentFile] = useState({})

    const [psuedonymizedFile, setPsuedonymizedFile] = useState({})

    const [analysisFile, setAnalysisFile] = useState({})

    const [title, setTitle] = useState()

    const [loading, setLoading] = useState(false)

    //Onsumbit of the modal, both files with title is send to backend

    async function submit() {
        setLoading(true)
        const data = new FormData()

        if (analysisResult) {
            data.append('analysisFile', analysisFile)
            data.append('title', title)
        } else {
            data.append('consentFile', consentFile)
            data.append('psuedonymizedFile', psuedonymizedFile)
            data.append('title', title)
        }

        Uploads.uploadFileContent(data, analysisResult).then((result) => {
            if (result.success) {
                setResult({
                    result: result.result,
                    update: false,
                })

                setVisible(false)

                //set summary modal visible true
                setSummaryVisible(true)
            } else {
                message.error("Please check the files")
            }
            setLoading(false)
            getData(range)
        })
    }

    //Function when uploading consent file
    function handleConsentFile(e) {
        console.log(e.target.files[0])
        let files = e.target.files[0]
        setConsentFile(files)
    }

    //Function when uploading analysis file
    function handleAnalysisFile(e) {
        let files = e.target.files[0]
        setAnalysisFile(files)
    }

    //Function when uploading psuedonymized file
    function handlePsuedonymizedFile(e) {
        let files = e.target.files[0]
        setPsuedonymizedFile(files)
    }

    //Function for onChange of Title
    function handleTitle(e) {
        setTitle(e.target.value)
    }

    return (
        <ErrorBoundary>
            <div className="card card-shadow">
                <Form onFinish={submit}>
                    <Title level={5}>Title</Title>
                    <Form.Item
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Title is required',
                            },
                        ]}
                    >
                        <Input onChange={handleTitle}></Input>
                    </Form.Item>
                    {analysisResult ? (
                        <div>
                            <br />
                            <Title level={5}>Analysis Result</Title>

                            <label>Select File</label>
                            <br />

                            <input
                                type="file"
                                name="consentFile"
                                onChange={(e) => handleAnalysisFile(e)}
                            />
                            <br />
                            <br />
                        </div>
                    ) : (
                        <>
                            <div>
                                <form id="myform">
                                    <br />
                                    <Title level={5}>Consent Data</Title>
                                    <label>Select File</label>
                                    <br />

                                    <input
                                        type="file"
                                        name="consentFile"
                                        onChange={(e) => handleConsentFile(e)}
                                    />
                                    <br />
                                    <br />
                                    <Title level={5}>Pseudonymized Checkup Data</Title>

                                    <label>Select File</label>
                                    <br />

                                    <input
                                        type="file"
                                        name="psuedonymizedFile"
                                        onChange={(e) => handlePsuedonymizedFile(e)}
                                    />
                                    <br />
                                    <br />
                                </form>
                            </div>

                            <div></div>
                            <br />
                        </>
                    )}
                    <Button loading={loading} htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </ErrorBoundary>
    )
}

/**
 * Component for uploading consent
 * @param {*} SheetJSFT
 * @param {*} uploadProps
 * @param {*} files
 * @returns
 */

function UpdateConsent({ setVisible, id, setSummaryVisible, setResult }) {
    const [consentFile, setConsentFile] = useState({})

    const [loading, setLoading] = useState(false)

    //On approve the files are send tp backend to upload to blob storage
    function approveUpload() {
        setLoading(true)
        const data = new FormData()

        data.append('consentFile', consentFile)
        data.append('id', id)

        Uploads.updateConsent(data).then(async (result) => {
            if (result.success) {
                //set results to show upload summary

                setResult({
                    result: result.result,
                    update: true,
                })
                setLoading(false)

                //set Visible of the update modal false
                setVisible(false)

                //Set summary modal visible true
                setSummaryVisible(true)
            } else {
                message.error(result.message)
                setLoading(false)
            }
        })
    }

    function cancelUpload() {
        setVisible(false)
    }

    function handleConsentFile(e) {
        let files = e.target.files[0]
        setConsentFile(files)
    }

    return (
        <ErrorBoundary>
            <div>
                <div>
                    <Title level={5}>Consent Data</Title>
                    <label>Select File</label>
                    <br />

                    <input
                        type="file"
                        name="consentFile"
                        onChange={(e) => handleConsentFile(e)}
                    />
                    <br />
                </div>

                <div className="upload-consent">
                    <Button loading={loading} onClick={approveUpload}>
                        Approve
                    </Button>
                    <Button onClick={cancelUpload}>Cancel</Button>
                </div>
            </div>
        </ErrorBoundary>
    )
}


/**
 * Function for showing the summary of upload or update of consent or analysis result
 * @param {*} param0
 * @returns
 */
function Summary({ result, analysisResult }) {
    return (
        <ErrorBoundary>
            <div>
                <p>Your Upload is Successfully Completed</p>
                {result.update ? (
                    <p>{result.result.consent_length} Records were updated</p>
                ) : analysisResult ? (
                    <p>{result.result.analysis_length} Records were uploaded</p>
                ) : (
                    <p>
                        {result.result.checkup_length} checkup records and{' '}
                        {result.result.consent_length} consent records were uploaded
                    </p>
                )}
            </div>
        </ErrorBoundary>
    )
}

