<template>
	<div>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
					<span class="text">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="food-list" ref="foodList">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item">
							<div class="icon">
								<img :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">${{food.price}}</span>
									<span class="old" v-show="food.oldPrice">${{food.oldPrice}}</span>
								</div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
    <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
	</div>
</div>
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from '../../components/shopcart/shopcart';
import cartcontrol from '../../components/cartcontrol/cartcontrol'


const ERR_OK = 0;
export default {
	props: {
		seller: {
			type: Object
		}
	},

	data() {
		return {
			goods: [],
      listHeight: [], //右侧内容列表每个区间的高度
      scrollY: 0
		};
	},
   components: {
      shopcart,
      cartcontrol
   },
  computed: {
    // 左侧当前索引
    currentIndex() {
      for(let i=0; i<this.listHeight.length; i++){
        let height1=this.listHeight[i];
        let height2=this.listHeight[i+1];
        if(!height2 || this.scrollY>=height1 && this.scrollY<height2){
          return i;
        }  
      }
      return 0;
    },
    //子组件选择food 选中food，goods就发生变化 从新计算
    selectFoods() {
      let foods=[];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if(food.count){
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },

	mounted() {
		  this.classMap = ['decrease','discount','special','invoice','guarantee'];

	    this.axios.get('/api/goods').then((response) => {
	        if(response.data.errno === ERR_OK){
	           this.goods =response.data.goods;
             //在这里回调异步之后 才计算menu的高度
             this.$nextTick(() => {
              this._initScroll();
              this._calculateHeight();
             })
	           console.log(this.goods);
	        }
	      }).catch((error) => {
	        console.log(error);
	    });
  }, 

	methods: {
    selectMenu(index,event) {
      //event._constructed浏览器原生没有这个事件 return掉防止两次点击
      //只有自定义派发的时候才执行
      if(!event._constructed){
        return;
      }
      let foodList=this.$refs.foodList;
      let el=foodList[index];
      this.foodsScroll.scrollToElement(el, 300);

      console.log(index);
    },
    //当初始化BScroll 当更改数据dom会跟着数据做映射 但是VUE在更新dom时时异步的
    //$nextTick中才会执行dom的更新 异步更新数据 dom没有变化 高度的更新就会有问题
		_initScroll() {
			this.menuScroll=new BScroll(this.$refs.menuWrapper, {
        click: true,
      });
      this.foodsScroll=new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on("scroll", (pos) => {
        this.scrollY=Math.abs(Math.round(pos.y));
      });
		},
    _calculateHeight() {
      //获取元素
      let foodList=this.$refs.foodList;
      //定义临时变量
      let height=0;
      this.listHeight.push(height);
      for(let i=0; i<foodList.length; i++){
        let item=foodList[i];
        height+=item.clientHeight;
        this.listHeight.push(height);
      }
    },
    //父组件 拿到子组件的方法
    addFood(target){
      this._drop(target);
    },
    //下落方法 访问子组件
    _drop(target){
      // 异步执行下落动画体验优化
      this.$nextTick(() => {
         this.$refs.shopcart.drop(target);
      });
    }

  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('images/decrease_3')
          &.discount
            bg-image('images/discount_3')
          &.guarantee
            bg-image('images/guarantee_3')
          &.invoice
            bg-image('images/invoice_3')
          &.special
            bg-image('images/special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
 
</style>



<!-- 知识点 -->
<!-- flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。 该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。
建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。
-->