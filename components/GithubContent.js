import { Select, Layout, List, Icon } from 'antd';
import { getGitList, changeType } from '../store/github';
import { useSelector, useDispatch } from 'react-redux';
const { Option } = Select;
const { Content } = Layout;

function GithubContent() {
  const { list, type, category } = useSelector(state => state.github);
  const dispatch = useDispatch();

  const handleChangeType = (type) => {
    dispatch(changeType(type));
    dispatch(getGitList);
  }

  return (
    <Content className="github-content">
      <div className="sub-header">
        <img className="icon source-icon" _v-7022f083="" src="https://e-gold-cdn.xitu.io/static/github.png?9140c37" />
        <span className="sub-logo-text">Github</span>
        <Select defaultValue={type} onChange={handleChangeType}>
          {category && category.map(item => (
            <Option value={item.value} key={item.value}>{item.text}</Option>
          ))}
        </Select>
      </div>
      <List
        grid={{ gutter: 10, column: 2 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <div className="git-card">
              <p className="git-card-row git-card-title">
                <a href={item.url}>{item.id}</a>
              </p>
              <p className="git-card-row git-card-desc">{item.description}</p>
              <p className="git-card-row git-card-foot">
                <Icon type="star" theme="filled" />
                <span>{String(item.starCount).replace(/(?=(\d{3})+(?!\d))/g, ',')}</span>
                &nbsp;&nbsp;&nbsp;
              <Icon type="branches" />
                <span>{item.forkCount}</span>
                &nbsp;&nbsp;&nbsp;
              <Icon type="bulb" theme="filled" style={{ color: '#f1e05a' }} />
                <span>{item.lang}</span>
              </p>
            </div>
          </List.Item>
        )}
      />
    </Content>
  );
}

export default GithubContent;