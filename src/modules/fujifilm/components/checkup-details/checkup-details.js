/***
 *
 *  Component For rendering all details, consent history, download history and result analysis
 * @description
 * @author Sameena
 */



import React, { useState, useEffect } from 'react'

import {
          Typography,
          Tabs,
} from 'antd'

import { Location, Card } from 'soxo-bootstrap-core'

import ErrorBoundary from '../error';

import ConsentHistory from '../consent-history/consent-history';

import DownloadHistory from '../download-history/download-history';

import DerivedAnalysis from '../derived-analysis/derived-analysis';

import './checkup-details.scss'

const { Title } = Typography

const { TabPane } = Tabs;

export default function CheckUpDetails({ ffmenu, ...props }) {

          const { id } = props.match.params;

          const urlParams = Location.search()

          const [activeKey, setActiveKey] = useState()

          const [consentId, setConsentId] = useState()

          const [consent, setConsent] = useState(urlParams.consent_id || urlParams.consentId)

          useEffect(() => {
                    setActiveKey(urlParams.activeKey)

          }, [urlParams])

          /**
           * Function to change tabs
           * @param {*} activeKey 
           */
          function changeTab(activeKey) {

                    Location.navigate({
                              url: `/check-up-details/${id}?activeKey=${activeKey}&data_id=${urlParams.data_id}`,
                    });
          };


          return (
                    <ErrorBoundary>
                              <div className='checkup-details'>
                                        <Card className='card-component' >

                                                  <div>
                                                            <h4>Data ID</h4>
                                                            <p>{urlParams.data_id}</p>
                                                  </div>
                                                  <div>
                                                            <h4>Nura ID</h4>
                                                            <p>{id}</p>
                                                  </div>
                                                  <div>
                                                            <h4>Consent ID</h4>
                                                            <p>{consentId}</p>
                                                  </div>



                                        </Card>
                                        <Tabs activeKey={activeKey} onChange={changeTab}>


                                                  <TabPane tab="Consent History" key="0">

                                                            <ConsentHistory id={id} data_id={urlParams.data_id} setConsentId={setConsentId} setConsent={setConsent} mode='CONSENT' />

                                                  </TabPane>
                                                  <TabPane tab="Download History" key="1">

                                                            <DownloadHistory id={id} consent={consent} setConsent={setConsent} />

                                                  </TabPane>
                                                  <TabPane tab="Result Analysis" key="2">

                                                            <DerivedAnalysis id={id} consent={consent} setConsent={setConsent} />

                                                  </TabPane>
                                                  <TabPane tab="Check-up History" key="3">

                                                            <ConsentHistory id={id} data_id={urlParams.data_id} setConsentId={setConsentId} setConsent={setConsent} mode='CHECKUP' isCheckup={true} />

                                                  </TabPane>

                                        </Tabs>
                              </div>
                    </ErrorBoundary>

          )
}
