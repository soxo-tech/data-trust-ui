/***
 *
 *This component shows th consent details in a Card
 * @description
 * @author Sameena
 */


import React from 'react';

import { Typography } from 'antd';

const { Title } = Typography;

export default function ConsentDetails() {

    return (

        <div>

            <Title level={5}> Nura ID</Title>
            <p> NURA2522</p>

            <Title level={5}> Registration Date</Title>
            <p> 26/06/2022</p>

            <Title level={5}> Consent ID</Title>
            <p> NURA2522</p>

            <Title level={5}> Consent Time</Title>
            <p> 25/028/2022 08:30 am</p>

            <Title level={5}> Lifetime</Title>
            <p> NURA2522</p>

            <Title level={5}> Nura ID</Title>
            <p> Permanent</p>

            <Title level={5}>Items</Title>
            <p> LIPID</p>
            <p> SUGAR</p>
            <p> QTBG</p>

        </div>

    )
}

