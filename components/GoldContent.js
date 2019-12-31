import 'moment/locale/zh-cn';
import { Select, Layout, List, Icon } from 'antd';
import moment from 'moment';
import { getGoldList, changeType } from '../store/gold';
import { useSelector, useDispatch } from 'react-redux';
const { Option } = Select;
const { Content } = Layout;

function GoldContent() {
  const { list, type, category } = useSelector(state => state.gold);
  const dispatch = useDispatch();

  const handleChangeType = (type) => {
    dispatch(changeType(type));
    dispatch(getGoldList);
  }

  return (
    <Content className="gold-content">
      <div className="sub-header">
        <span className="sub-logo-icon"></span>
        <span className="sub-logo-text">掘金</span>
        <Select defaultValue={type} width={120} onChange={handleChangeType}>
          {category && category.map(item => (
            <Option value={item.value} key={item.value}>{item.text}</Option>
          ))}
        </Select>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={list}
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