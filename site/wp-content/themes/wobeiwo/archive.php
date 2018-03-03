<?php get_template_part( 'header', get_post_format() ); ?>
<div class="list_wrap clearfix">
	<div class="col list_l fl">
		<?php if(function_exists('cmp_breadcrumbs')) cmp_breadcrumbs();?>
		
		<?php //pagination($query_string); ?>
		
		<ul class="l_item_list" style="min-height:400px;">
			<?php if (have_posts()) : ?>
			<?php while (have_posts()) : the_post(); ?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-n-j') ?></span></li>
			<?php endwhile; ?>
			<?php else : ?>
			<?php endif; wp_reset_query(); ?>
		</ul>
        <?php pagination($query_string); ?>
		
	</div>
	<div class="col page_r fr">
		<h2 class="l_h2_tit">热门电影</h2>
		<ul class="l_item_list">
			<?php
				query_posts('cat=1&posts_per_page=6');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a class="singleRa" href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
			
		</ul>
		<h2 class="l_h2_tit">最新下载</h2>
		<ul class="l_item_list">
			<?php
				$args = array(
					'meta_key' => 'views',
					'orderby' => 'meta_value',
					'order' => 'date'
				);
				query_posts($args);
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a class="singleRa" href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
	</div>
</div>
<?php get_template_part( 'footer', get_post_format() ); ?>
