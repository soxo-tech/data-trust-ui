/***
 *
 *
 * @description
 * @author Sameena
 */

/**
 * Check Up data Listing Component
 */

import React, { useState, useEffect, useContext } from 'react';

import { Table, Typography, Skeleton, Tag } from 'antd';

import { GlobalContext, Card, DateUtils, Location } from 'soxo-bootstrap-core';

import { UserLogs, CoreUsers } from '../../../../models';

import ErrorBoundary from '../error';

const { Title } = Typography;

export default function DownloadHistory({ ffmenu, id,consent,setConsent, ...props }) {

     const [downloadHistory, setDownloadHistory] = useState([])

     const [page, setPage] = useState(1);

     const [limit, setLimit] = useState(10);

     const [loading, setLoading] = useState(true)

     if (props.match)
          id = props.match.params;

     const { user = {} } = useContext(GlobalContext);

     var { consent_id, analysisResult } = Location.search()

     if (analysisResult) {
          analysisResult = eval(analysisResult)
     }


     var columns = []

     

     //Columns for fujifilm
     // if (ffmenu) {

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
                    render: (record) => {

                         const attributes = JSON.parse(record.attributes)

                         return attributes.consent_id
                    }
               },
               {
                    title: 'Consent Time',
                    key: 'time',
                    render: (record) => {

                         if (record.consent)

                              return DateUtils.getFormattedTimeDate(record.consent.consent_time)
                    }
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
                    render: (record) => {

                         return DateUtils.getFormattedTimeDate(record.created_at)

                    }
               },
               {
                    title: 'Lifetime',
                    key: 'lifetime',
                    render: (record) => {

                         if (record.consent && record.consent.attributes) {

                              const attributes = JSON.parse(record.consent.attributes)


                              return attributes.lifetime_type
                         }
                    }
               },
               {
                    title: 'Items',
                    key: 'items',
                    render: (record) => {


                         if (record.consent && record.consent.attributes) {
                              const attributes = JSON.parse(record.consent.attributes)

                              return attributes.items;
                         }
                    }
               },

          ]
     // } else {

          //Columns for Nura
          // columns = [
          //      {
          //           title: '#',
          //           dataIndex: 'index',
          //           render: (value, item, index) => {
          //                return (page - 1) * limit + index + 1;
          //           },
          //      },
          //      {
          //           title: 'Downloaded User',
          //           key: 'user',
          //           render: (record) => {

          //                return record.created_by_details['name']

          //           }
          //      },
          //      {
          //           title: 'Last Download',
          //           key: 'last_download',
          //           render: (record) => {

          //                return DateUtils.getFormattedTimeDate(record.created_at)

          //           }
          //      },
          //      {
          //           title: 'Discarded Date',
          //           key: 'discarded',
          //           render: (record) => {

          //                return record.consent.discarded_date ? DateUtils.getFormattedTimeDate(record.consent.discarded_date) : null

          //           }
          //      },
          // ]
     // }


     useEffect(() => {
          getData(consent_id);

     }, [consent_id])

     /**
     * Function to load the data for screen
     */
     async function getData(consent) {

          var result = await UserLogs.getDownloadHistory(id, analysisResult)


          //In ffmenu only load the data for downloads of the current user
          if (ffmenu && analysisResult !== true)

               result = result.result.filter((element) => element.created_by === user.id)

          //To gete download history of analysis result
          else if (analysisResult === true)

               result = result.result

          //In Nura load downlaods with respect to consent id
          else if (consent && consent!==null)

               result = result.result.filter((element) => {
                    const attributes = JSON.parse(element.attributes)
                    if (attributes.consent_id)
                         return attributes.consent_id === parseInt(consent)
               })
          else
          result = result.result

          setDownloadHistory(result)
          setLoading(false)

     }

     /**
      * Function triggered when consnet is removed
      */
     function removeConsent(){
          setConsent(null)
          getData(null)
     }

     return (

          <ErrorBoundary>
               <div className='consent-history'>
                    {loading ? <Skeleton /> : <>

                         <Card className={'history'}>
                              {/* <Title level={3}>Download History</Title> */}
                              <div className='history-table'>
                                   <div>
                                   {consent && consent!==null?<h4>Consent Id : <Tag closable onClose={removeConsent}>{consent}</Tag></h4>:null}
                                        {/* <Title level={5}>Nura ID</Title>
                                        <p>{downloadHistory[0] && downloadHistory[0].pseudonymous_nura_id ? downloadHistory[0].pseudonymous_nura_id : id}</p> */}
                                   </div>
                                   {/* <div>
                                   <Title level={5}>Registration Date</Title>
                                   <p>{downloadHistory[0] && downloadHistory[0].order_date ? DateUtils.getFormattedTimeDate(downloadHistory[0].order_date) : null}</p>
                              </div> */}
                                   <div>
                                        {/* <Title level={5}>Consent ID</Title>
                                        <p>{downloadHistory[0] && downloadHistory[0].consent ? downloadHistory[0].consent.id : null}</p> */}
                                   </div>
                                   <div>
                                        {/* <Title level={5}>Consent Status</Title>
                                   <p>Updated</p> */}
                                   </div>

                              </div>

                              <Table
                                   scroll={{ x: true }}
                                   dataSource={downloadHistory}
                                   columns={columns}
                                   pagination={{
                                        current: page,
                                        onChange(current) {
                                            setPage(current);
                                        },
                                    }}
                              />
                         </Card>
                         {/* {ffmenu ? null :
                                                  <Card className={'details'}>
                                                            <ConsentDetails />
                                                  </Card>} */}

                    </>}
               </div>
          </ErrorBoundary>
     )
}