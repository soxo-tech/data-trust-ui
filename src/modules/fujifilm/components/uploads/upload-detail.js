/***
 *
 *
 * @description
 * @author Sameena
 */

/**
 * Check Up data Listing Component
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
} from 'antd'

import { Location, Card, DateUtils } from 'soxo-bootstrap-core'

import { MoreOutlined, ReloadOutlined } from '@ant-design/icons'

import moment from 'moment'

import './upload-detail.scss'

import { UploadDetails, UserLogs, Uploads, CoreUsers } from '../../../../models'

const { Title } = Typography

export default function UploadDetailComponent({
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

  const { id } = props.match.params

  var columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (value, item, index) => {
        return index + 1
        // return (page - 1) * limit + index + 1;
      },
    },
    {
      title: 'Nura ID',
      key: 'id',
      dataIndex: 'psuedonymous_nura_id',
    },
    // {
    //   title: 'Registration Date',
    //   key: 'title',
    //   render: (record) => {
    //     if (record.order_date)
    //       return DateUtils.getFormattedTimeDate(record.order_date)
    //   },
    // },
    {
      title: 'Consent ID',
      key: 'No of records',
      render: (record) => {
        return record.consent && record.consent.id
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
  if (ffmenu) {
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
  }

  //
  columns.push(
    {
      title: 'Lifetime',
      key: 'time',
      // dataIndex: 'time',
      render: (record) => {
        if (record.consent && record.consent.attributes) {
          const attributes = JSON.parse(record.consent.attributes)

          return attributes.lifetime_type
            ? attributes.lifetime_type
            : attributes.lifetimeType
        }
      },
    },
    {
      title: 'Items',
      key: 'by',
      // dataIndex: 'by',
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
        function toConsentHistory() {

          Location.navigate({
            url: `/checkup-list/update-consent/${record.psuedonymous_nura_id}?data_id=${record.id}`,
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
              {updated ? null : (
                <Button
                  loading={downloadLoading}
                  onClick={(e) => download(e, record)}
                >
                  Download
                </Button>
              )}

              {ffmenu ? (
                <Dropdown
                  overlay={() => {
                    return menu(record)
                  }}
                  placement="bottomLeft"
                >
                  {/* <Button size="small"> */}
                  <MoreOutlined />
                  {/* </Button> */}
                </Dropdown>
              ) : (
                <Button onClick={toConsentHistory}>Consent History</Button>
              )}
            </div>
          </div>
        )
      },
    },
  )

  //For analysis Result
  if (analysisResult) {
    columns = [
      {
        title: '#',
        dataIndex: 'index',
        render: (value, item, index) => {
          // return (page - 1) * limit + index + 1;
          return index + 1
        },
      },
      {
        title: 'Nura ID',
        key: 'id',
        dataIndex: 'psuedonymous_nura_id',
      },

      {
        title: 'Data ID',
        key: 'data_id',
        render: (record) => {
          return record.id
        },
      },
      // {
      //         title: 'Registration Date',
      //         key: 'title',
      //         render: (record) => {
      //                 return record.order_date ? DateUtils.getFormattedTimeDate(record.order_date): null

      //         }
      // },
      {
        title: 'Consent ID',
        key: 'No of records',
        render: (record) => {
          if (record.attributes) {
            const attributes = JSON.parse(record.attributes)

            return attributes.consentId?attributes.consentId:null
          }
        },
      },
      // {
      //   title: 'Consent Status',
      //   key: 'status',
      //   dataIndex: 'status',
      // },
      {
        title: 'Last Download',
        key: 'last_download',
        render: (record) => {
          return record.downloads && record.downloads.created_at
            ? DateUtils.getFormattedTimeDate(record.downloads.created_at)
            : null
        },
      },

      {
        title: 'Action',
        key: 'action',
        render: (record) => {
          return (
            <div className="action">
              <Button
                loading={downloadLoading}
                onClick={(e) => download(e, record)}
              >
                Download
              </Button>

              <Popconfirm
                title="Are you sure you want to delete the record? "
                onConfirm={(e) => deleteRecord(e, record)}
                onCancel={() => { }}
                okText="Yes"
                cancelText="No"
              >
                <Button>Delete</Button>
              </Popconfirm>

              <Dropdown
                overlay={() => {
                  return menu(record)
                }}
                placement="bottomLeft"
              >
                {/* <Button size="small"> */}
                <MoreOutlined />
                {/* </Button> */}
              </Dropdown>
            </div>
          )
        },
      },
    ]
  }

  useEffect(() => {
    getData()
  }, [])

  /**
   * Function to load the data for screen
   */

  function getData() {
    setLoading(true)

    UploadDetails.getDetails(id, analysisResult).then((result) => {
      setUploads(result)

      setLoading(false)
    })
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
        if (analysisResult) {
          Uploads.download(res.buffer[0], analysisResult)
        } else {
          Uploads.download(res.buffer.data, analysisResult)
        }

        // Uploads.download(res.buffer.data)

        getData()
      } else {
        message.error(res.message)
      }
    })
  }

  /**
   * Function for deleting a record
   */

  async function deleteRecord(e, record) {
    const result = await UploadDetails.deleteRecord(record.id)
    if (result.success) {
      message.success(result.message)
      getData()
    } else {
      message.error(result.message)
    }
  }

  /**
   * Menu for additional options
   */

  const menu = (record) => {
    return (
      <Menu
        onClick={(event) => {
          handleClick(event, record)
        }}
      >
        <Menu.Item key="download_history">Download History</Menu.Item>

        {/* For Analysis Result Menu */}
        {analysisResult ? null : (
          <>
            <Menu.Item key="consent_history">Consent History</Menu.Item>

            <Menu.Item key="result_analysis">Result Analysis</Menu.Item>
          </>
        )}
        {/* For Analysis Result Menu */}
      </Menu>
    )
  }

  /**
   * Function to get download history
   *
   */
  async function getDownloadHistory(record) {
    var config = {
      queries: [
        {
          field: 'type',
          value: 'download',
        },
        {
          field: 'upload_details_id',
          value: record.id,
        },
      ],
    }
    await UserLogs.get(config).then((result) => {
      setDownloadHistory({
        ...record,
        download: result.result,
      })
    })
  }

  /**
   *
   * @param {*} params
   */
  async function handleClick(params, record) {
    if (params.key === 'download_history') {
      if (analysisResult) {
        // await getDownloadHistory(record)
        setDownloadHistory(record)
        setVisible(true)
      } else {
        Location.navigate({
          url: `/checkup-list/downloads-history/${record.psuedonymous_nura_id}?&consentId=${record.consent.id}`,
        })
      }
    } else if (params.key === 'consent_history') {
      Location.navigate({
        url: `/checkup-list/update-consent/${record.psuedonymous_nura_id}`,
      })
    } else if (params.key === 'result_analysis') {
      Location.navigate({
        url: `/checkup-list/derived-analysis/${record.psuedonymous_nura_id}`,
      })
    }
  }

  return (
    <div className='card card-shadow'>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="page-header">
            <Title level={3}>{caption}</Title>

            <div className="page-actions">
              <Button onClick={getData}>
                <ReloadOutlined />
              </Button>
            </div>
          </div>

          <div>
            <Title level={4}>{uploads.title}</Title>
            <div className="detail-header">
              <p>ID :{uploads.id}</p>
            </div>
            <Table
              scroll={{ x: true }}
              dataSource={uploads.upload_details}
              columns={columns}
            />
          </div>

          {/**
           * Modal for Download History
           */}
          <Modal
            destroyOnClose={true}
            footer={null}
            title="Download History"
            visible={visible}
            okText="Okay"
            onOk={() => {
              setVisible(false)
            }}
            onCancel={() => {
              setVisible(false)
            }}
          >
            <DownloadHistory data={downloadHistory} />
          </Modal>

          {/**
           * Modal for Download History ends
           */}
        </>
      )}
    </div>
  )
}

/**
 * Download history to be diplayed as a Component
 *
 * @param {*} param0
 * @returns
 */
function DownloadHistory({ data }) {
  const [downloadHistory, setDownloadHistory] = useState([])

  /**
   * Function to get download history
   */

  async function getData() {
    var config = {
      queries: [
        {
          field: 'type',
          value: 'download',
        },
        {
          field: 'psuedonymous_nura_id',
          value: data.psuedonymous_nura_id,
        },
      ],
      // baseUrl: process.env.REACT_APP_FF
    }

    var result = await UserLogs.get(config)

    Promise.all(
      result.result.map(async (ele, key) => {
        var id = ele.created_by

        var user = await CoreUsers.get()

        user = user.result.filter((user) => user.id === id)

        return {
          ...ele,
          created_by_details: user[0],
        }
      }),
    ).then((arr) => {
      setDownloadHistory(arr)
      //   setLoading(false)
    })
  }

  useEffect(() => {
    getData()
  }, [])

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
      title: 'Downloaded User',
      key: 'user',
      render: (record) => {

        return record.created_by_details['name']

      }
    },

    {
      title: 'Last Download',
      key: 'last_download',
      render: (record) => {

        return DateUtils.getFormattedTimeDate((record.created_at));
      },
    },
  ]

  return (
    <div>
      <p>Nura ID :</p>
      <p>{data.psuedonymous_nura_id}</p>

      <p></p>

      <Table
        scroll={{ x: true }}
        dataSource={downloadHistory}
        columns={columns}
      />
    </div>
  )
}
