<?php get_template_part( 'header', get_post_format() ); ?>
<?php
	$site_url = get_bloginfo('url');
	$template_url = get_bloginfo('template_url');
	$sticky = get_option('sticky_posts');
	rsort( $sticky );
?>
<div class="wrapper clearfix">
	<div class="wrap_l fl">
		<h2 class="l_h2_tit">热门电影</h2>
		<ul class="l_item_list">
		<?php
			$posin = array_slice( $sticky, 0, 10);
			query_posts(array('post__in' => $posin, 'posts_per_page' => 3));
			if(have_posts()) : while (have_posts()) : the_post();
		?>
		<li class="l_item"><a href="<?php the_permalink() ?>"><img src="<?php echo catch_first_image(); ?>" onerror="javascript:this.src='<?php echo $template_url; ?>/images/nophoto.gif'" alt="<?php the_title(); ?>"><span class="l_i_tit"><?php the_title(); ?></span></a></li>
		<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
	</div>
	
	<div class="wrap_m fl">
		<div class="l_h2_tit clearfix"><h2 class="fl"><a href="<?php echo $site_url ?>/category/2017最新电影">最新电影</a></h2><a href="<?php echo $site_url ?>/category/2017最新电影" class="fr">更多&gt;&gt;</a></div>
		<ul class="l_item_list">
		<?php
			query_posts('cat=1&posts_per_page=16');
			if(have_posts()) : while (have_posts()) : the_post();
		?>
			<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
		<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
		
		<h2 class="l_h2_tit"><a href="<?php echo $site_url ?>/category/国剧">最新国产剧</a><a href="<?php echo $site_url ?>/category/国剧" class="fr">更多&gt;&gt;</a></h2>
		<ul class="l_item_list">
		<?php
			query_posts('cat=10&posts_per_page=16');
			if(have_posts()) : while (have_posts()) : the_post();
		?>
			<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
		<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
	</div>
	<div class="wrap_r fl">
		<h2 class="l_h2_tit">精选电影专题</h2>
		<ul class="l_item_list">
			<?php
				query_posts('cat=1&posts_per_page=12');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="r_item"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
		<h2 class="l_h2_tit">下载排行榜</h2>
		<ul class="l_item_list">
			<?php
				query_posts('cat=1&posts_per_page=12&sticky=true');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="r_item"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
	</div>
</div>

<!-- <div class="mid_ad"><img src="" width="1000" height="120"></div> -->

<div class="wrapper clearfix">
	<div class="wrap_l fl">
		<h2 class="l_h2_tit">电视剧推荐</h2>
		<ul class="l_item_list">
		<?php
			query_posts('cat=10&posts_per_page=3');
			if(have_posts()) : while (have_posts()) : the_post();
		?>
		<li class="l_item"><a href="<?php the_permalink() ?>"><img src="<?php echo catch_first_image(); ?>" onerror="javascript:this.src='<?php echo $template_url; ?>/images/nophoto.gif'" alt="<?php the_title(); ?>"><span class="l_i_tit"><?php the_title(); ?></span></a></li>
		<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
	</div>
	<div class="wrap_m fl" style="width:39%">
		<div class="tab_box">
			<div class="l_h2_tit tabs clearfix">
				<h2 class="fl cur_tab"><a href="<?php echo $site_url ?>/category/经典高清电影">高清电影</a></h2>
				<h2 class="fl"><a href="<?php echo $site_url ?>/category/3D电影">3D电影</a></h2>
			</div>
			<ul class="l_item_list mid">
			<?php
				query_posts('cat=5&posts_per_page=12');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
			<ul class="l_item_list mid none">
			<?php
				query_posts('cat=6&posts_per_page=12');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
		</div>
		<div class="tab_box bt">
			<div class="l_h2_tit tabs clearfix">
				<h2 class="fl cur_tab"><a href="<?php echo $site_url ?>/category/港台电影">港台电影</a></h2>
				<h2 class="fl"><a href="<?php echo $site_url ?>/category/日韩电影">日韩电影</a></h2>
			</div>
			<ul class="l_item_list mid">
			<?php
				query_posts('cat=13&posts_per_page=12');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
			<ul class="l_item_list mid none">
			<?php
				query_posts('cat=14&posts_per_page=12');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
		</div>
	</div>
	<div class="wrap_r fl" style="width:39%">
		<div class="tab_box">
			<div class="l_h2_tit tabs clearfix">
				<h2 class="fl cur_tab"><a href="<?php echo $site_url ?>/category/日韩剧">日韩剧</a></h2>
				<h2 class="fl"><a href="<?php echo $site_url ?>/category/欧美剧">欧美剧</a></h2>
			</div>
			<ul class="l_item_list">
				<?php
					query_posts('cat=11&posts_per_page=12');
					if(have_posts()) : while (have_posts()) : the_post();
				?>
					<li class="r_item"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></li>
				<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
			<ul class="l_item_list none">
				<?php
					query_posts('cat=12&posts_per_page=12');
					if(have_posts()) : while (have_posts()) : the_post();
				?>
					<li class="r_item"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></li>
				<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
		</div>
		<div class="tab_box bt">
			<div class="l_h2_tit tabs clearfix">
				<h2 class="fl cur_tab"><a href="<?php echo $site_url ?>/category/动画电影">动画电影</a></h2>
				<h2 class="fl"><a href="<?php echo $site_url ?>/category/MP4手机电影">MP4手机电影</a></h2>
			</div>
			<ul class="l_item_list">
				<?php
					query_posts('cat=7&posts_per_page=12');
					if(have_posts()) : while (have_posts()) : the_post();
				?>
					<li class="r_item"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></li>
				<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
			<ul class="l_item_list none">
				<?php
					query_posts('cat=8&posts_per_page=12');
					if(have_posts()) : while (have_posts()) : the_post();
				?>
					<li class="r_item"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></li>
				<?php  endwhile; endif; wp_reset_query(); ?>
			</ul>
		</div>
	</div>
</div>
<script src="<?php echo $template_url;?>/js/jquery.min.js"></script>
<script type="text/javascript">
	$(function(){
		$('.tabs h2').hover(function(){
			var index = $(this).index();
			$(this).parent().find('h2').removeClass('cur_tab');
			$(this).addClass('cur_tab');
			$(this).parent().parent().find('.l_item_list').hide();
			$(this).parent().parent().find('.l_item_list').eq(index).show();
		});
	})
</script>
<?php get_template_part( 'footer', get_post_format() ); ?>
