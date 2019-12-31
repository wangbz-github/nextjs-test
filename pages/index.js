import 'antd/dist/antd.css';
import '../css/index.css';
import { Layout, Input } from 'antd';
import GoldContent from '../components/GoldContent';
import GithubContent from '../components/GithubContent';
import axios from 'axios';

const { Header } = Layout;
const { Search } = Input;

function Index(props) {
  return (
    <Layout>
      <Header className="header">
        <span className="logo">开课吧</span>
        <Search className="search" placeholder="开课搜索，如：java，阿里巴巴，前端面试" onSearch={value => console.log(value)} enterButton />
      </Header>
      <Layout className="main">
        <GoldContent list={props.listGold} />
        <GithubContent list={props.listGit} />
      </Layout>
    </Layout>
  );
}

Index.getInitialProps = async ctx => {
  const resGold = await axios.post(`https://extension-ms.juejin.im/resources/gold`, {
    category: "backend",
    order: "heat",
    offset: 0,
    limit: 30,
  });

  const resGit = await axios.post(`https://extension-ms.juejin.im/resources/github`, {
    category: "trending",
    period: "day",
    lang: "javascript",
    offset: 0,
    limit: 30,
  });

  return {
    listGold: resGold.data.data,
    listGit: resGit.data.data,
  };
}

export default Index;