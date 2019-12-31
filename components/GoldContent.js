import { Select, Layout, List, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const { Option } = Select;
const { Content } = Layout;

function GoldContent(props) {
  return (
    <Content className="gold-content">
      <div className="sub-header">
        <span className="sub-logo-icon"></span>
        <span className="sub-logo-text">掘金</span>
        <Select defaultValue="all" width={120} onChange={() => { }}>
          <Option value="all">首页</Option>
          <Option value="frontend">前端</Option>
          <Option value="backend">后端</Option>
        </Select>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={props.list}
        renderItem={item => (
          <List.Item>
            <a className="gold-item" href={item.url}>
              <div className="gold-item-extra">
                <Icon type="caret-up" />
                <div>{item.collectionCount}</div>
              </div>
              <div className="gold-item-main">
                <div className="gold-item-title">{item.title}</div>
                <div className="gold-item-foot">
                  <span>{moment(item.date.iso).fromNow()}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span>{item.user.username}</span>
                </div>
              </div>
            </a>
          </List.Item>
        )}
      />
    </Content>
  );
}

export default GoldContent;