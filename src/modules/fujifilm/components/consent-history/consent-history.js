/***
 *Component for Consent History
 *
 * @description
 * @author Sameena
 */



import React, { useState, useEffect } from 'react';

import { Table, Button, Typography, } from 'antd';

import { Location, Card } from '@soxo/bootstrap-core';

import ConsentDetails from '../consent-details/consent-details';

import './consent-history.scss'
import { UploadDetails } from '../../../../models';


const { Title, Text } = Typography;

export default function ConsentHistory() {
          const [consentHistory, setConsentHistory] = useState([{
                    id: '',
                    time: '',
                    lifetime: '',
                    items: '',

          }])

          const [page, setPage] = useState(1);

          const [limit, setLimit] = useState(20);

          //ffmenu is maintaine to determine which user is using(nura or fujifilm)
          const [ffmenu, setFFmenu] = useState(false)

          const columns = [
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

          //Extra columns for fujifilm
          if (ffmenu) {
                    columns.push(
                              {
                                        title: 'Registration Date',
                                        key: 'regDate',
                                        dataIndex: 'regDate'
                              },
                              {
                                        title: 'Last Download',
                                        key: 'lastDownlaod',
                                        dataIndex: 'lastDownload'
                              },
                              {
                                        title: 'Discarded date',
                                        key: 'discarded',
                                        dataIndex: 'discarded'
                              },
                    )
          }

          columns.push(
                    {
                              title: 'Action',
                              key: 'action',
                              render: (ele) => {
                                        function toDownloadHistory() {

                                                  Location.navigate({
                                                            url: `/checkup-list/downloads-history`,
                                                  });

                                        }

                                        function toDerivedAnalysis() {

                                                  Location.navigate({
                                                            url: `/checkup-list/derived-analysis`,
                                                  });

                                        }

                                        return (

                                                  <div>
                                                            {ffmenu ?
                                                                      <Button onClick={onDiscard}>Discard</Button> :
                                                                      <>
                                                                                <Button onClick={toDownloadHistory}>Download History</Button>

                                                                                <Button onClick={toDerivedAnalysis}>Analysis Result</Button>
                                                                      </>}


                                                  </div>
                                        )
                              },
                    },

          )


          /**
           * function to discard a consent
           */

          function onDiscard() {

          }

          useEffect(() => {
                    getData();

          }, [])

          function getData() {


                    const queries = [{
                              field: 'psuedonymous_nura_id',
                              value: 16
                    },
                    {
                              field: 'hash',
                              value: 'consent'
                    },
                    ]

                    var config = {
                              queries
                    }
                    UploadDetails.get(config).then(result => {
                              setConsentHistory(result.result)
                    })
          }



          return (
                    <div>
                              <Title level={3}>Consent History</Title>

                              <div className='consent-history'>



                                        <Card className={'history'}>
                                                  <Title level={5}>Nura ID</Title>

                                                  <div className='history-table'>
                                                            <p>REGISTRATION NUMBER</p>
                                                            <p> 23/06/2022</p>
                                                  </div>

                                                  <Table
                                                            scroll={{ x: true }}
                                                            //  rowKey={(record) => record.da_id}
                                                            dataSource={consentHistory}
                                                            columns={columns}
                                                  // pagination={{
                                                  //     current: page,
                                                  //     onChange(current) {
                                                  //         setPage(current);
                                                  //     },
                                                  // }}
                                                  />
                                        </Card>
                                        {ffmenu ? null :
                                                  <Card className={'details'}>
                                                            <ConsentDetails />
                                                  </Card>}


                              </div>
                    </div>


          )
}

