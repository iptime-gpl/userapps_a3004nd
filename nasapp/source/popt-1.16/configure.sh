#!/bin/sh -x

ToolChainPrefix="/usr/local/920t_le/bin/arm_920t_le-"
CC=${ToolChainPrefix}gcc

ConfigOpt="--host=armv4tl-hardhat-linux --target=armv4tl-hardhat-linux --build=i686-pc-linux --enable-gettext=no"

./configure ${ConfigOpt} CC=${CC} --prefix="/source/popt-1.16/install"
