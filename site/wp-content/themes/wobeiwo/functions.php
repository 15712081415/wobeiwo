<?php
//获取文章的第一张图片地址
function catch_that_image() {
   global $post, $posts;
   $first_img = '';
   ob_start();
   ob_end_clean();
   $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches); 
 
   $first_img = '';
   if(empty($matches[1])) $first_img = "/default.jpg";
   else $first_img = $matches [1][0];
   return $matches[1];
 }
 
function catch_first_image($size = 'full') {
    global $post;
    $first_img = '';
    if (has_post_thumbnail($post->ID)) {
        $first_img = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID),$size);
        $first_img = $first_img[0];
    }else{
        ob_start();
        ob_end_clean();
        $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
        $first_img = $matches [1] [0];
        if(empty($first_img)){
            $random = mt_rand(1, 20);
            $first_img = get_bloginfo('template_directory').'/images/random/tb'.$random.'.jpg';
        }
    }
    return $first_img;
}

function catch_the_image( $id ) {
  // global $post, $posts;
  $first_img = '';
  // 如果设置了缩略图
  $post_thumbnail_id = get_post_thumbnail_id( $id );
  if ( $post_thumbnail_id ) {
    $output = wp_get_attachment_image_src( $post_thumbnail_id, 'large' );
    $first_img = $output[0];
  }
  else { // 没有缩略图，查找文章中的第一幅图片
    ob_start();
    ob_end_clean();
    $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
    $first_img = $matches [1] [0];
    if(empty($first_img)){ // 既没有缩略图，文中也没有图，设置一幅默认的图片
      $first_img = "http://yourdomain.tld/images/default.jpg";
    }
  }
  return $first_img;
}
add_theme_support( 'post-thumbnails' );

function mmimg($postID) {
	$cti = catch_that_image();
	$showimg = $cti;
	has_post_thumbnail();
	if ( has_post_thumbnail() ) { 
		$thumbnail_image_url = wp_get_attachment_image_src(get_post_thumbnail_id(), 'thumbnail');
		$shareimg = $thumbnail_image_url[0];
	} else { 
		$shareimg = $showimg;
	};
	return $shareimg;
} 
/**
 * WordPress 添加面包屑导航 
 * https://www.wpdaxue.com/wordpress-add-a-breadcrumb.html
 */
function cmp_breadcrumbs() {
	$delimiter = '»'; // 分隔符
	$before = '<span class="current">'; // 在当前链接前插入
	$after = '</span>'; // 在当前链接后插入
	if ( !is_home() && !is_front_page() || is_paged() ) {
		echo '<div class="pos_tit l_h2_tit" id="crumbs">'.__( '当前位置：' , 'cmp' );
		global $post;
		$homeLink = home_url();
		echo ' <a itemprop="breadcrumb" href="' . $homeLink . '">' . __( '首页' , 'cmp' ) . '</a> ' . $delimiter . ' ';
		if ( is_category() ) { // 分类 存档
			global $wp_query;
			$cat_obj = $wp_query->get_queried_object();
			$thisCat = $cat_obj->term_id;
			$thisCat = get_category($thisCat);
			$parentCat = get_category($thisCat->parent);
			if ($thisCat->parent != 0){
				$cat_code = get_category_parents($parentCat, TRUE, ' ' . $delimiter . ' ');
				echo $cat_code = str_replace ('<a','<a itemprop="breadcrumb"', $cat_code );
			}
			echo $before . '' . single_cat_title('', false) . '' . $after;
		} elseif ( is_day() ) { // 天 存档
			echo '<a itemprop="breadcrumb" href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a> ' . $delimiter . ' ';
			echo '<a itemprop="breadcrumb"  href="' . get_month_link(get_the_time('Y'),get_the_time('m')) . '">' . get_the_time('F') . '</a> ' . $delimiter . ' ';
			echo $before . get_the_time('d') . $after;
		} elseif ( is_month() ) { // 月 存档
			echo '<a itemprop="breadcrumb" href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a> ' . $delimiter . ' ';
			echo $before . get_the_time('F') . $after;
		} elseif ( is_year() ) { // 年 存档
			echo $before . get_the_time('Y') . $after;
		} elseif ( is_single() && !is_attachment() ) { // 文章
			if ( get_post_type() != 'post' ) { // 自定义文章类型
				$post_type = get_post_type_object(get_post_type());
				$slug = $post_type->rewrite;
				echo '<a itemprop="breadcrumb" href="' . $homeLink . '/' . $slug['slug'] . '/">' . $post_type->labels->singular_name . '</a> ' . $delimiter . ' ';
				echo $before . get_the_title() . $after;
			} else { // 文章 post
				$cat = get_the_category(); $cat = $cat[0];
				$cat_code = get_category_parents($cat, TRUE, ' ' . $delimiter . ' ');
				echo $cat_code = str_replace ('<a','<a itemprop="breadcrumb"', $cat_code );
				echo $before . get_the_title() . $after;
			}
		} elseif ( !is_single() && !is_page() && get_post_type() != 'post' ) {
			$post_type = get_post_type_object(get_post_type());
			echo $before . $post_type->labels->singular_name . $after;
		} elseif ( is_attachment() ) { // 附件
			$parent = get_post($post->post_parent);
			$cat = get_the_category($parent->ID); $cat = $cat[0];
			echo '<a itemprop="breadcrumb" href="' . get_permalink($parent) . '">' . $parent->post_title . '</a> ' . $delimiter . ' ';
			echo $before . get_the_title() . $after;
		} elseif ( is_page() && !$post->post_parent ) { // 页面
			echo $before . get_the_title() . $after;
		} elseif ( is_page() && $post->post_parent ) { // 父级页面
			$parent_id  = $post->post_parent;
			$breadcrumbs = array();
			while ($parent_id) {
				$page = get_page($parent_id);
				$breadcrumbs[] = '<a itemprop="breadcrumb" href="' . get_permalink($page->ID) . '">' . get_the_title($page->ID) . '</a>';
				$parent_id  = $page->post_parent;
			}
			$breadcrumbs = array_reverse($breadcrumbs);
			foreach ($breadcrumbs as $crumb) echo $crumb . ' ' . $delimiter . ' ';
			echo $before . get_the_title() . $after;
		} elseif ( is_search() ) { // 搜索结果
			echo $before ;
			printf( __( '%s 查询结果', 'cmp' ),  get_search_query() );
			echo  $after;
		} elseif ( is_tag() ) { //标签 存档
			echo $before ;
			printf( __( 'tag %s', 'cmp' ), single_tag_title( '', false ) );
			echo  $after;
		} elseif ( is_author() ) { // 作者存档
			global $author;
			$userdata = get_userdata($author);
			echo $before ;
			printf( __( '作者存档: %s', 'cmp' ),  $userdata->display_name );
			echo  $after;
		} elseif ( is_404() ) { // 404 页面
			echo $before;
			_e( '未找到', 'cmp' );
			echo  $after;
		}
		if ( get_query_var('paged') ) { // 分页
			if ( is_category() || is_day() || is_month() || is_year() || is_search() || is_tag() || is_author() )
				echo sprintf( __( '( 第 %s 页 )', 'cmp' ), get_query_var('paged') );
		}
		echo '</div>';
	}
}


function pagination($query_string){
	global $wp_query;
 
	$big = 999999999; // 需要一个不太可能的整数
 
	$pagination_links = paginate_links( array(
		'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
		'format' => '?paged=%#%',
		'current' => max( 1, get_query_var('paged') ),
		'total' => $wp_query->max_num_pages
	) );
 
	echo $pagination_links;
	/*global $posts_per_page, $paged;
	$my_query = new WP_Query($query_string ."&posts_per_page=-1");
	$total_posts = $my_query->post_count;
	if(empty($paged))$paged = 1;
	$prev = $paged - 1;                         
	$next = $paged + 1; 
	$range = 2; 
	$showitems = ($range * 2)+1;
	$pages = ceil($total_posts/$posts_per_page);
	if(1 <= $pages){
		echo "<p class='pagination bb'><span>";
		echo "<a style='margin-right:5px;' href='".get_pagenum_link(1)."'>首页</a>";
		echo ($paged > 1 && $showitems < $pages)? "<a href='".get_pagenum_link($prev)."'>« 上一页</a>":"";       
		for ($i=1; $i <= $pages; $i++){
			if (1 != $pages &&( !($i >= $paged+$range+1 || $i <= $paged-$range-1) || $pages <= $showitems )){
				echo ($paged == $i)? "<a class='cur'>".$i."</a>":"<a style='margin:0 5px;' href='".get_pagenum_link($i)."'>".$i."</a>"; 
			}
		}
		echo ($paged < $pages && $showitems < $pages) ? "<a href='".get_pagenum_link($next)."'>下一页 »</a>" :"";
		echo "<a style='margin-left:5px;' href='".get_pagenum_link($pages)."'>末页</a>";
		echo "</span></p>\n";
    }*/
}