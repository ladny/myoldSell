import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Hello from '@/components/Hello';
import header from "@/components/header/header";
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';
import goods from '@/components/goods/goods';
import error from '@/components/error';
import '@/common/stylus/index.styl';

Vue.use(Router);
Vue.use(VueAxios,axios);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello
    }, {
	  path: '/ratings',
	  name: 'ratings',
	  component: ratings
	}, {
	  path: '/seller',
	  name: 'seller',
	  component: seller
	}, {
	  path: '/goods',
	  name: 'goods',
	  component: goods
	}, {
		path: '*',
		name: 'error',
		component: error
	}
  ],
  linkActiveClass: 'active', 
  // 设置 链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 linkActiveClass 来全局配置。


});
