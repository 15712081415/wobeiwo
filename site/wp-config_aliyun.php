<?php
/**
 * WordPress基础配置文件。
 *
 * 这个文件被安装程序用于自动生成wp-config.php配置文件，
 * 您可以不使用网站，您需要手动复制这个文件，
 * 并重命名为“wp-config.php”，然后填入相关信息。
 *
 * 本文件包含以下配置选项：
 *
 * * MySQL设置
 * * 密钥
 * * 数据库表名前缀
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/zh-cn:%E7%BC%96%E8%BE%91_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL 设置 - 具体信息来自您正在使用的主机 ** //
/** WordPress数据库的名称 */
define('WP_CACHE', true);
define( 'WPCACHEHOME', '/data/home/xyu4493760001/htdocs/wp-content/cache/' );
define('DB_NAME', 'xdm447914568_db');

/** MySQL数据库用户名 */
define('DB_USER', 'xdm447914568');

/** MySQL数据库密码 */
define('DB_PASSWORD', '15986849165bibi');

/** MySQL主机 */
define('DB_HOST', 'localhost');

/** 创建数据表时默认的文字编码 */
define('DB_CHARSET', 'utf8');

/** 数据库整理类型。如不确定请勿更改 */
define('DB_COLLATE', '');

/**#@+
 * 身份认证密钥与盐。
 *
 * 修改为任意独一无二的字串！
 * 或者直接访问{@link https://api.wordpress.org/secret-key/1.1/salt/
 * WordPress.org密钥生成服务}
 * 任何修改都会导致所有cookies失效，所有用户将必须重新登录。
 *
 * @since 2.6.0
 */
// define('AUTH_KEY',         'VLb_>-(oE-2viZY{-pT6tv>x-%N>EJUUel-0J66Hq$OlTK_IsrKtJPTpDJ:rz^!;');
// define('SECURE_AUTH_KEY',  ']Xdb_qBp8)mXj<jIsyX9R0{CLh9jHZ;:in2_?tw$t2mKP{x.7a+[Z3,kF-RMVs+D');
// define('LOGGED_IN_KEY',    'I+i7iRlbC+gR c>1MN^w|o|VY|8,Zgfbv2y rsV{J=_{[`g54Jk*:$M6Z# 1z2Q+');
// define('NONCE_KEY',        '!p}L`;cj^sF]k=oll-:t1PM,|}fO]{ww^A5A}crExvQAWhdN~]}S:vh~Y{Z[/*3%');
// define('AUTH_SALT',        'NBW7ya(s<?*OvKE]tR*j|zqV+d5K:F28g>-H-fm{GCt^K+|yg9Zu=83H$v%{ASk4');
// define('SECURE_AUTH_SALT', 'eLnRPf~Prb.`8|#.fqA;<=Xi[*q`L:AfSC%)UES8H5ci#uZ`}E~V@26}j,w__]Q]');
// define('LOGGED_IN_SALT',   'v3A#/rh&DzEuQH5M?#L2B|,EAs@WK/S[H$~%/.3[w=fXz<.^J)~.zGu}L^L6vn}L');
// define('NONCE_SALT',       'Wq>[b#]nX$(hX_3hc=3wE<`~VVCg7If,ZJLgD*-ZHNIgrg}SDSbJLE.[g|;hp{iV');
// salt url: https://api.wordpress.org/secret-key/1.1/salt/
define('JWT_AUTH_SECRET_KEY', 'VLb_>-(oE-2viZY{-pT6tv>x-%N>EJUUel-0J66Hq$OlTK_IsrKtJPTpDJ:rz^!;');
define('JWT_AUTH_CORS_ENABLE', false); // 跨域支持
/**#@-*/

/**
 * WordPress数据表前缀。
 *
 * 如果您有在同一数据库内安装多个WordPress的需求，请为每个WordPress设置
 * 不同的数据表前缀。前缀名只能为数字、字母加下划线。
 */
$table_prefix  = 'wp_';

/**
 * 开发者专用：WordPress调试模式。
 *
 * 将这个值改为true，WordPress将显示所有用于开发的提示。
 * 强烈建议插件开发者在开发环境中启用WP_DEBUG。
 *
 * 要获取其他能用于调试的信息，请访问Codex。
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/**
 * zh_CN本地化设置：启用ICP备案号显示
 *
 * 可在设置→常规中修改。
 * 如需禁用，请移除或注释掉本行。
 */
define('WP_ZH_CN_ICP_NUM', true);
define('WP_MEMORY_LIMIT', '256M');
/* 好了！请不要再继续编辑。请保存本文件。使用愉快！ */

/** WordPress目录的绝对路径。 */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** 设置WordPress变量和包含文件。 */
require_once(ABSPATH . 'wp-settings.php');
