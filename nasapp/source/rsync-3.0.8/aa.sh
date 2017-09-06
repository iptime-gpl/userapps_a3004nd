#!/bin/sh

sed 's/#define HAVE_LCHMOD 1/\/\* #undef HAVE_LCHMODE\*\//' config.h > config.1
mv config.1 config.h

sed 's/#define HAVE_LUTIMES 1/\/\* #undef HAVE_LUTIMES\*\//' config.h > config.1
mv config.1 config.h
