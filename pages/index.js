import 'antd/dist/antd.css';
import '../css/index.css';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout, Input } from 'antd';
import GoldContent from '../components/GoldContent';
import GithubContent from '../components/GithubContent';
import { getGoldList } from '../store/gold';
import { getGitList } from '../store/github';

const { Header } = Layout;
const { Search } = Input;

function Index() {
  return (
    <Layout>
      <Header className="header">
        <span className="logo">开课吧</span>
        <Search className="search" placeholder="开课搜索，如：java，阿里巴巴，前端面试" onSearch={value => console.log(value)} enterButton />
      </Header>
      <Layout className="main">
        <GoldContent />
        <GithubContent />
      </Layout>
    </Layout>
  );
}


Index.getInitialProps = async ({ reduxStore }) => {
  await reduxStore.dispatch(getGoldList);
  await reduxStore.dispatch(getGitList);

  return reduxStore.getState();
}

export default connect()(Index);