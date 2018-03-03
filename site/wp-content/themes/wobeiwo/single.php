<?php get_template_part( 'header', get_post_format() ); ?>

<div class="list_wrap clearfix">
	<div class="col page_l fl">
		
		<div class="art_wrap">
			<h1><?php the_title(); ?></h1>
			<div class="art_content">
			<?php if ( have_posts() ) : the_post(); ?>
			<?php the_content(); ?>
			<?php endif; ?> 
			</div>
			<div class="rel_wrap">
				<h2 class="rel_tit">相关推荐</h2>
				<ul class="rel_list">
				<?php
				global $post;
				$cats = wp_get_post_categories($post->ID);
				if ($cats) {
					$args = array(
						'category__in' => array( $cats[0] ),
						'post__not_in' => array( $post->ID ),
						'showposts' => 6,
						'caller_get_posts' => 1
					);
				  query_posts($args);
				  if (have_posts()) {
					while (have_posts()) {
					  the_post(); update_post_caches($posts); ?>
				  <li> <a href="<?php the_permalink(); ?>" rel="bookmark" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></li>
				<?php
					}
				  }
				  else {
					echo '<li>暂无相关文章</li>';
				  }
				  wp_reset_query();
				}
				else {
				  echo '<li>暂无相关文章</li>';
				}
				?>
				</ul>
			</div>
			<div class="comments-area">
			<!-- UY BEGIN
			<div id="uyan_frame"></div>
			<script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js"></script>
			UY END -->
			</div>
		</div>
	</div>
	<div class="col page_r fr">
		<h2 class="l_h2_tit">热门电影</h2>
		<ul class="r_item_list">
			<?php
				query_posts('cat=1&posts_per_page=6');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a class="singleRa" href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
			
		</ul>
		<h2 class="l_h2_tit">最新下载</h2>
		<ul class="r_item_list">
			<?php
				query_posts('cat=1&posts_per_page=6');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a class="singleRa" href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
	</div>
</div>
<?php get_template_part( 'footer', get_post_format() ); ?>
