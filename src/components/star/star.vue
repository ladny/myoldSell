<template>
	<div class="star" :class="starType">
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" ></span>	
	</div>	
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'
	export default {
		props:{
			size:{
				type: Number
			},
			score:{
				type: Number
			}
		},
		computed:{
			starType() {
				return 'star-'+this.size;
			},
			itemClasses() {
				let result = []; // 存储返回的星星
				let score = Math.floor(this.score*2)/2; // 分数四舍五入取正或取半
				let hasDecimal = score % 1 !== 0; // 小数部分，是否有半星
				let integer = Math.floor(score); // 取整数，全星
				for(let i=0;i<integer;i++){
					result.push(CLS_ON);
				}
				if(hasDecimal){
					result.push(CLS_HALF);
				}
				while(result.length < LENGTH) {
					result.push(CLS_OFF);
				}
				return result;
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('images/star48_on')
        &.half
          bg-image('images/star48_half')
        &.off
          bg-image('images/star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('images/star36_on')
        &.half
          bg-image('images/star36_half')
        &.off
          bg-image('images/star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('images/star24_on')
        &.half
          bg-image('images/star24_half')
        &.off
          bg-image('images/star24_off')
	 
</style>