/*
 * @Author: Mcikey
 * @Date: 2024-03-19 10:35:43
 * @LastEditors: hyman
 * @LastEditTime: 2024-04-12 14:39:25
 * @Description: 请填写简介
 */
import React from 'react';
import { Table, Tag, Divider, Alert } from 'antd';
import styles from './index.module.css';

const columns = {
  1: [
    {
      title: '提示token数',
      dataIndex: 'prompt_tokens',
    },
    {
      title: '补全token数',
      dataIndex: 'completion_tokens',
    },
    {
      title: '模型倍率',
      dataIndex: 'modelRate',
    },
    {
      title: '分组倍率',
      dataIndex: 'modelGroupRate',
    },
    {
      title: '补全倍率',
      dataIndex: 'modelOutputRate',
    },
    {
      title: '模型名称',
      dataIndex: 'modelLabel',
    },
    {
      title: '渠道倍率',
      dataIndex: 'magnification',
    },
    {
      title: '渠道商',
      dataIndex: 'carrierNikeName',
    },
    {
      title: '本轮总计消耗费用',
      dataIndex: 'totalUsage',
    },
  ],
  0: [
    {
      title: '按次计费费用',
      dataIndex: 'useOnePrice',
    },
    {
      title: '模型名称',
      dataIndex: 'modelLabel',
    },
    {
      title: '渠道倍率',
      dataIndex: 'magnification',
    },
    {
      title: '渠道商',
      dataIndex: 'carrierNikeName',
    },
    {
      title: '本轮总计消耗费用',
      dataIndex: 'totalUsage',
    },
  ],
};

const renderAlert = {
  1: (
    <Alert
      message="按TOKENS计费费用 = (分组倍率 × 模型倍率 × （提示token数 + 补全token数 × 补全倍率）/ 500000 ) x 渠道倍率 （单位：美元）"
      type="warning"
      showIcon
    />
  ),
  0: (
    <Alert
      message="按次计费费用 = 按次费用 x 渠道倍率"
      type="warning"
      showIcon
    />
  ),
};

export default function CurrentChatUsage({ dataSource }) {
  console.log(dataSource, 'dataSource');
  return (
    <div className={styles.currentChatUsage} style={{ paddingBottom: 24 }}>
      <Divider orientation="center">费用计算方式：</Divider>
      <div className={styles.computeUsageWay}>
        {renderAlert?.[dataSource?.modelPriceWay] || ''}
      </div>
      <Divider orientation="center">费用计算详情</Divider>
      <Table
        columns={columns?.[dataSource?.modelPriceWay] || []}
        dataSource={[dataSource]}
        pagination={false}
      />
    </div>
  );
}
