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
  Dropdown,
  Menu,
  Skeleton,
  message,
} from 'antd'

import { Location, Card, DateUtils } from 'soxo-bootstrap-core'

import './derived-analysis.scss'

import { MoreOutlined } from '@ant-design/icons'

import { UploadDetails, CoreUsers, Uploads } from '../../../../models';

import ErrorBoundary from '../error'

const { Title } = Typography

export default function DerivedAnalysis({ ffmenu, ...props }) {
  // Get pagination number
  const { id } = props.match.params

  const [derivedAnalysis, setDerivedAnalysis] = useState([])

  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)

  const [limit, setLimit] = useState(10)

  var { consentId } = Location.search()

  // ffmenu is maintained to determine which user is using(nura or fujifilm)
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (value, item, index) => {
        return (page - 1) * limit + index + 1
      },
    },
    {
      title: 'Data ID',
      key: 'id',
      render: (record) => {
        return record.id
      },
    },
    {
      title: 'Consent ID',
      key: 'consent_id',
      render: (record) => {
        if (record && record.attributes) {

          const attributes = JSON.parse(record.attributes)

          return attributes.consent_id
        }
      },
    },
    {
      title: 'Title',
      key: 'title',
      render: (record) => {
        return record.uploads[0].title
      },
    },
    {
      title: 'Upload Date',
      key: 'date',
      render: (record) => {
        return DateUtils.getFormattedTimeDate(record.created_at)
      },
    },
    {
      title: 'Upload User',
      key: 'user',
      render: (record) => {
        return record.created_by_details['name']
      },
    },
  ]

  useEffect(() => {
    getData()
  }, [])

  /**
   * Function to load the data for screen
   */
  function getData() {
    setLoading(true)

    UploadDetails.loadDetails(id).then((result) => {

      // This filtering is used to get analysis result of the consent id in url
      

      result=result.uploadsWithConsent.filter((element)=>JSON.parse(element.attributes).consent_id===consentId)

      setDerivedAnalysis(result)
      setLoading(false)

    })
  }

  // Extra columns for fujifilm
  if (ffmenu) {
    columns.push({
      title: 'Last Download',
      key: 'lastDownload',
      render: (record) => {
        console.log(record)
        return DateUtils.getFormattedTimeDate(record.downloads[0].created_at)
      },
    })
  }

  columns.push({
    title: 'Action',
    key: 'action',
    render: (ele) => {
      return (
        <div>
          <div style={{ display: 'flex' }}>
            <Button onClick={(e) => download(e, ele)}>Download</Button>

            {ffmenu ? (
              <Dropdown
                overlay={() => {
                  return menu(ele)
                }}
                placement="bottomLeft"
              >
                <MoreOutlined />
              </Dropdown>
            ) : null}
          </div>
        </div>
      )
    },
  })

  /**
   * Function for download
   */
  function download(e, record) {
    const analysisResult = true

    const bulk = false

    const id = record.upload_details[0].id

    Uploads.downloadFiles(id, analysisResult, bulk).then((res) => {
      if (res.success) {
        Uploads.download(res.buffer[0], analysisResult)

        // setBtnLoading(false)
        getData()
      } else {
        message.error(res.message)
      }
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
        <Menu.Item key="download_history">Download History</Menu.Item>

        <Menu.Item key="result_analysis">Result Analysis</Menu.Item>
      </Menu>
    )
  }

  function handleClick(params, record) {
    if (params.key === 'download_history')
      Location.navigate({
        url: `/checkup-list/downloads-history/${id}?&analysisResult=${true}`,
      })
    else if (params.key === 'result_analysis') {
      Location.navigate({
        url: `/analysis-result`,
      })
    }
  }

  return (

    <ErrorBoundary>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="derived-card">
            <Card className={'table'}>

              <Title level={3}>Derived Analysis Results </Title>

              <Table
                scroll={{ x: true }}
                dataSource={derivedAnalysis}
                columns={columns}
                pagination={{
                  current: page,
                  onChange(current) {
                      setPage(current);
                  },
              }}
              />
            </Card>
          </div>
        </>
      )}
    </ErrorBoundary>
  )
}
