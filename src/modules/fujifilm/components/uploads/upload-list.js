/***
 *
 *
 * @description
 * @author Sameena
 */

/**
 * Check Up data and Analysis Result Listing Component
 */

import React, { useState, useEffect } from 'react'

import {
  Table,
  Button,
  Typography,
  Modal,
  message,
  Input,
  Dropdown,
  Menu,
  Skeleton,
} from 'antd'

import { Location, DateUtils } from 'soxo-bootstrap-core'

import { MoreOutlined, ReloadOutlined } from '@ant-design/icons'

import './upload-list.scss'

import { CoreUsers, Uploads } from '../../../../models'

const { Title, Text } = Typography

export default function UploadList({ ffmenu, analysisResult, mode }) {
  const [checkUpData, setCheckUpData] = useState([])

  const [id, setId] = useState()

  const [visible, setVisible] = useState(false)

  const [uploadVisible, setUploadVisible] = useState(false)

  const [loading, setLoading] = useState(true)

  const [btnLoading, setBtnLoading] = useState(false)

  const [result, setResult] = useState([])

  const [summaryVisible, setSummaryVisible] = useState(false)

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (value, item, index) => {
        // return (page - 1) * limit + index + 1;
        return index + 1
      },
    },
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Number of Records',
      key: 'No of records',
      dataIndex: 'number_of_records',
    },
    {
      title: 'Upload Date',
      key: 'date',
      render: (record) => {
        return (
          <span>
            {record && record.created_at
              ? DateUtils.formatDate(record.created_at)
              : null}
          </span>
        )
      },
    },
    {
      title: 'Upload Time',
      key: 'time',
      render: (record) => {
        return (
          <span>
            {record && record.created_at
              ? DateUtils.formatTime(record.created_at)
              : null}
          </span>
        )
      },
    },
    {
      title: 'Uploaded By',
      key: 'by',
      render: (record) => {
        return (
          <span>
            {record && record.created_by
              ? record.created_by_details['name']
              : null}
          </span>
        )
      },
    },
  ]

  //Additional columns for fujifilm
  if (ffmenu) {
    columns.push(
      {
        title: 'Consent Status',
        key: 'status',
        dataIndex: 'status',
      },
      {
        title: 'Last Download',
        key: 'lastDownload',
        render: (record) => {
          return record.download
            ? DateUtils.getFormattedTimeDate(record.download.created_at)
            : null
        },
      },
    )
  }

  columns.push({
    title: 'Action',
    key: 'action',
    render: (ele) => {
      function toUpdate() {
        Location.navigate({
          url: `/checkup-list/details/${ele.id}`,
        })
      }

      return analysisResult ? (
        <div style={{ display: 'flex' }}>
          <Button
            loading={btnLoading}
            onClick={(e) => downloadFiles(e, ele.id)}
          >
            Download
          </Button>

          <Dropdown
            overlay={() => {
              return menu(ele)
            }}
            placement="bottomLeft"
          >
            <MoreOutlined />
          </Dropdown>
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <Button onClick={toUpdate}>Details</Button>

          <Button
            loading={btnLoading}
            onClick={(e) => downloadFiles(e, ele.id)}
          >
            Download
          </Button>

          {ffmenu ? null : (
            <Button onClick={(e) => modalVisible(e, ele)}>
              Update Consent
            </Button>
          )}
        </div>
      )
    },
  })

  useEffect(() => {
    getData()
  }, [])

  /**
   * Function to download Files. Bulk is kept true
   * @param {*} e
   * @param {*} id
   */

  async function downloadFiles(e, id) {
    setBtnLoading(true)
    const bulk = true

    Uploads.downloadFiles(id, analysisResult, bulk).then((res) => {
      if (res.success) {
        //Each content is downloaded as zip
        res.buffer.map((data) => {
          Uploads.download(data)
        })

        setBtnLoading(false)

        getData()
      } else {
        message.error(res.message)

        setBtnLoading(false)
      }
    })
  }

  /**
   * Get Upload Data from Uploads table, then load user from core_users for each upload records
   */

  async function getData() {
    setLoading(true)

    const result = await Uploads.getData(analysisResult)

    Promise.all(
      result.map(async (ele, key) => {
        var id = ele.created_by
        var user = await CoreUsers.get()
        user = user.result.filter((user) => user.id === id)

        return {
          ...ele,
          created_by_details: user[0],
        }
      }),
    ).then((arr) => {
      setCheckUpData(arr)
      setLoading(false)
    })
  }

  /**
   * Open menu with additional options
   */

  const menu = (record) => {
    return (
      <Menu
        onClick={(event) => {
          handleClick(event, record)
        }}
      >
        <Menu.Item key="analysis_details">Analysis Details</Menu.Item>
      </Menu>
    )
  }

  function handleClick(params, record) {
    if (params.key === 'analysis_details')
      Location.navigate({
        url: `/analysis-result-details/${record.id}`,
      })
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

  function modalVisible(e, ele) {
    setVisible(true)

    setId(ele.id)
  }

  function uploadModal() {
    setUploadVisible(true)
  }

  return (
    <div>
      <div className="page-header">
        {analysisResult ? (
          <Title level={3}>ANALYSIS RESULTS DATA</Title>
        ) : (
          <Title level={3}>CHECK UP DATA</Title>
        )}

        <div className="actions">
          {!analysisResult && ffmenu ? null : (
            <div className="upload-list">
              <Button onClick={uploadModal}>Upload</Button>
            </div>
          )}

          <Button onClick={getData}>
            <ReloadOutlined />
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton />
      ) : analysisResult ? (
        <Table
          scroll={{ x: true }}
          dataSource={checkUpData}
          columns={analysisColumns}
        />
      ) : (
        <Table
          scroll={{ x: true }}
          dataSource={checkUpData}
          columns={columns}
        />
      )}

      {/**
       * Upload Consent and Checkup Modal
       */}

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
          setSummaryVisible={setSummaryVisible}
          setResult={setResult}
        />
      </Modal>

      {/**
       * Upload Consent and Checkup Modal ends
       */}

      {/**
       * Update Consent Modal
       */}

      <Modal
        destroyOnClose={true}
        footer={null}
        title="Data to Upload"
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
          id={id}
          setSummaryVisible={setSummaryVisible}
          setResult={setResult}
        />
      </Modal>

      {/**
       * Update Consent Modal
       */}

      {/**
       * summary modal starts
       */}

      <Modal
        cancelButtonProps={{ hidden: true }}
        title="Upload Summary"
        visible={summaryVisible}
        okText="Okay"
        onOk={() => {
          setSummaryVisible(false)
          getData()
        }}
      >
        <Summary result={result} analysisResult={analysisResult} />
      </Modal>

      {/**
       * Summary model ends
       */}
    </div>
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
        message.error(result.message)
      }
      setLoading(false)
      getData()
    })
  }

  //Function when uploading consent file
  function handleConsentFile(e) {
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
    <div>
      <Title level={5}>Title</Title>
      <Input onChange={handleTitle}></Input>

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
              <Title level={5}>Pseudonymised Checkup Data</Title>

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
      <Button loading={loading} onClick={submit}>
        Submit
      </Button>
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
  )
}

/**
 * Function for showing the summary of upload or update of consent or analysis result
 * @param {*} param0
 * @returns
 */
function Summary({ result, analysisResult }) {
  return (
    <div>
      <p>Your upload is successfully Completed</p>
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
  )
}
