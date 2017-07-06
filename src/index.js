import React from 'react';
import { render } from 'react-dom';
import Tab from './tab/Tab';
import TabItem from './tab/TabItem';

const tabs = (<Tab activeIndex="this3" type="card" position="top">
  <TabItem index="this1" title="tab1" key="1">tab1</TabItem>
  <TabItem index="this2" title="tab2" key="2">tab2</TabItem>
  <TabItem index="this3" title="tab3" key="3">tab3</TabItem>
  <TabItem index="this4" title="tab4" key="4">tab4</TabItem>
  <TabItem index="this5" title="tab5" key="5">tab5</TabItem>
  <TabItem index="this6" title="tab6" key="6">tab6</TabItem>
  <TabItem index="this7" title="tab7" key="7">tab7</TabItem>
</Tab>);
render(tabs, document.getElementById('root'));
