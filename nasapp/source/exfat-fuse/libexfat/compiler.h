/*
	compiler.h (09.06.13)
	Compiler-specific definitions. Note that unknown compiler is not a
	showstopper.

	Copyright (C) 2010-2013  Andrew Nayenko

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef COMPILER_H_INCLUDED
#define COMPILER_H_INCLUDED

#ifdef EFM_PATCH // not defined.
#else
#if __STDC_VERSION__ < 199901L
#error C99-compliant compiler is required
#endif
#endif // EFM_PATCH

#if defined(__GNUC__) /* this includes Clang */

#define PRINTF __attribute__((format(printf, 1, 2)))
#define NORETURN __attribute((noreturn))
#define PACKED __attribute__((packed))

#else

#define PRINTF
#define NORETURN
#define PACKED

#endif

#define CONCAT2(a, b) a ## b
#define CONCAT1(a, b) CONCAT2(a, b)
#define STATIC_ASSERT(cond) \
	static inline void CONCAT1(static_assert, __LINE__)(void) \
		{switch (0) {case 0: case cond:;}}

#endif /* ifndef COMPILER_H_INCLUDED */
