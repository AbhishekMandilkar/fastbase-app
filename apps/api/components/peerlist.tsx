'use client'
import {useTheme} from 'next-themes'
import React from 'react'

const PeerList = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    return <div>PeerList {isDark}</div>;
}

export default PeerList