<?php
$site_url = get_bloginfo('url');
$template_url = get_bloginfo('template_url');
$title = get_bloginfo('blogname');
$keywords = get_bloginfo('keywords');
$description = get_bloginfo('description');
global $post;
if (is_home()){

}elseif (is_single()){
    if($post->post_excerpt){
        $description = $post->post_excerpt;
    }else{
        $description = mb_strimwidth(strip_tags($post->post_content),0,200,'');
    }
    $title = get_the_title().' - '.$title;
}elseif (is_page()){
    $title = get_the_title().' - '.$title;
}elseif (is_category()){
    
}elseif (is_tag()){

}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <?php if (is_category()) {?>
    <title><?php single_cat_title(); ?> - <?php echo $title?></title>
    <?php } else {?>
    <title><?php echo $title?></title>
    <?php }?>
    <meta name="keywords" content="2018最新电影,最新电影下载,电视剧下载,高清电影下载,迅雷下载" />
    <meta name="description" content="<?php echo $description; ?>" />
    <link href="<?php bloginfo('template_url');?>/css/style.css" type="text/css" rel="stylesheet">
    <link rel="shortcut icon" href="<?php echo $siteurl."/favicon.ico";?>" type="image/x-icon" />
    <link rel="https://api.w.org/" href="<?php echo $siteurl;?>/wp-json/">
</head>

<body>
<div class="header">
	<div class="clearfix pr">
		<div class="fl head_logo">
            <?php if ( is_single() || is_archive() || is_page()) { ?>
                <a href="<?php echo $site_url; ?>" title="<?php bloginfo('name'); ?>"><img src="<?php echo $template_url;?>/images/logo.png" alt="<?php bloginfo('name'); ?>" /></a>
            <?php } else { ?>
                <h1>
                    <a href="<?php bloginfo('url'); ?>" title="<?php bloginfo('name'); ?>"><img src="<?php echo $template_url;?>/images/logo.png" alt="<?php bloginfo('name'); ?>" /></a>
                </h1>
            <?php } ?>
		</div>
		<div class="clearfix fl head_search">
			<div class="clearfix fl h_s_box">
				<form target="_blank" action="<?php echo $site_url; ?>" method="get" onSubmit="javascript:if(this.s.value=='') return false;">
					<span class="fl s_l">
						<select class="s_where"><option>站内</option></select>
                        <!-- <span class="s_where">站内</span> -->
						<input type="text" name="s" class="keywords" maxlength="50" value="" placeholder="请输入关键字" onFocus="this.style.width='280px';" onBlur="if(this.value == ''){this.style.width='';}" />
					</span>
					<span class="fl s_r"><input type="submit" class="s_btn" value="搜索" /></span>
				</form>
			</div>
			<div class="h_s_words fl">
			<p>
				<?php wp_tag_cloud('smallest=12&largest=12&orderby=count&unit=px&number=10'); ?>
			</p>
			</div>
		</div>
		<a href="javascript:;" onclick="JavaScript:addToFavorite()" class="add_fav">加入收藏夹</a>
	</div>
	<div class="head_menu">
		<p class="m1">
            <a href="<?php echo $site_url; ?>" >首页</a>
            <?php
        	/*$menuParameters = array(
        	    'menu'=>'header_nav',
        		'container'	=> 'div',
        		'echo'	=> false,
        		'items_wrap' => '%3$s',
        		'depth'	=> 0,
        	    );
        	echo strip_tags(wp_nav_menu( $menuParameters ), '<a>' );*/
            ?>
            <a href="<?php echo $site_url;?>/category/2017最新电影">2017最新电影</a>
            <a href="<?php echo $site_url;?>/category/3D电影">3D电影</a>
            <a href="<?php echo $site_url;?>/category/MP4手机电影">MP4手机电影</a>
            <a href="<?php echo $site_url;?>/category/动画电影">动画电影</a>
            <a href="<?php echo $site_url;?>/category/国剧">国产连续剧</a>
            <a href="<?php echo $site_url;?>/category/国语配音电影">国语配音电影</a>
            <a href="<?php echo $site_url;?>/category/微电影">微电影</a>
            <a href="<?php echo $site_url;?>/category/日韩剧">日韩剧</a>
            <a href="<?php echo $site_url;?>/category/日韩电影">日韩电影</a>
            <a href="<?php echo $site_url;?>/category/欧美剧">欧美剧</a>
            <a href="<?php echo $site_url;?>/category/港台电影">港台电影</a>
            <a href="<?php echo $site_url;?>/category/经典高清电影">经典高清电影</a>
            <a href="<?php echo $site_url;?>/category/综艺节目">综艺节目</a>
		</p>
        <p class="m2">专题分类：
            <a href="<?php echo $site_url; ?>/category/爱情">爱情</a>
            <a href="<?php echo $site_url; ?>/category/科幻">科幻</a>
            <a href="<?php echo $site_url; ?>/category/神秘">神秘</a>
            <a href="<?php echo $site_url; ?>/category/喜剧">喜剧</a>
            <a href="<?php echo $site_url; ?>/category/战争">战争</a>
            <a href="<?php echo $site_url; ?>/category/恐怖">惊悚</a>
            <a href="<?php echo $site_url; ?>/category/恐怖">恐怖</a>
            <a href="<?php echo $site_url; ?>/category/幻想">幻想</a>
            <a href="<?php echo $site_url; ?>/category/奇幻">奇幻</a>
            <a href="<?php echo $site_url; ?>/category/历史">历史</a>
            <a href="<?php echo $site_url; ?>/category/动作">动作</a>
            <a href="<?php echo $site_url; ?>/category/剧情">剧情</a>
            <a href="<?php echo $site_url; ?>/category/冒险">冒险</a>
            <a href="<?php echo $site_url; ?>/category/传记">传记</a>
            <a href="<?php echo $site_url; ?>/category/纪录">纪录</a>
        </p>
	</div>
</div>
