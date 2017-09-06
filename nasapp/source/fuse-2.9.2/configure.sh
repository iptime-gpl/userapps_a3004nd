SOURCE_PATH=/home/`whoami`/MarvellNas/source
CROSS_COMPILE=arm-mv5sft-linux-gnueabi
ToolChainInclude="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/usr/include"
ToolChainLib="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/usr/lib"

./configure --host=${CROSS_COMPILE} --target=${CROSS_COMPILE} --build=i686-pc-linux \
		   CC=${CROSS_COMPILE}-gcc \
		   CPPFLAGS="-DEFM_PATCH" \
		   ac_cv_func_utimensat=no \
