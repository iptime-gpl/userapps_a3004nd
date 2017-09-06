#!/bin/sh -x

ToolChainPrefix="/usr/local/920t_le/bin/arm_920t_le-"
CC=${ToolChainPrefix}gcc

ConfigOpt="--host=armv4tl-hardhat-linux --target=armv4tl-hardhat-linux --build=i686-pc-linux --with-included-popt"

./configure ${ConfigOpt} CC=${CC} \
		LDFLAGS="-L/source/attr-2.4.46/install/lib -L/source/acl-2.2.51/install/lib -L/source/popt-1.16/install/lib" \
		CPPFLAGS="-I/source/attr-2.4.46/install/include -I/source/acl-2.2.51/install/include -I/source/popt-1.16/install/include" \
		LIBS="-liconv -lattr -lacl -lpopt" \
		--prefix="/source/rsync-3.0.8/install"
