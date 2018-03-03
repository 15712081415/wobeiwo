<?php get_template_part( 'header', get_post_format() ); ?>

<div class="list_wrap clearfix">
	<div class="col list_l fl">
		<?php if (have_posts()) : ?>
		<?php if(function_exists('cmp_breadcrumbs')) cmp_breadcrumbs();?>
		
		<?php pagination($query_string); ?>
		<ul class="l_item_list" style="min-height:400px;">
			
			<?php while (have_posts()) : the_post(); ?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-n-j') ?></span></li>
			<?php endwhile; ?>
		</ul>
        <?php pagination($query_string); ?>
		<?php else : ?>
			<p class="noSearchResult">没有搜索到结果！</p>
		<?php endif; ?>
	</div>
	<div class="col page_r fr">
		<h2 class="l_h2_tit">热门电影</h2>
		<ul class="l_item_list">
			<?php
				query_posts('cat=1&posts_per_page=5');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
			
		</ul>
		<h2 class="l_h2_tit">最新下载</h2>
		<ul class="l_item_list">
			<?php
				query_posts('cat=1&posts_per_page=5');
				if(have_posts()) : while (have_posts()) : the_post();
			?>
				<li class="l_item clearfix"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a><span><?php the_time('Y-m-j'); ?></span></li>
			<?php  endwhile; endif; wp_reset_query(); ?>
		</ul>
	</div>
</div>
<?php get_template_part( 'footer', get_post_format() ); ?>
