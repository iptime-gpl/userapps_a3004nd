#ifndef __FLASH_MAP_H
#define __FLASH_MAP_H

/*
   ------------------------------------------------------- 0x0
        Boot Core
   ------------------------------------------------------- 0x2F00
        Boot Params: boot_params_t
   ------------------------------------------------------- 0x2F80
        Mac Address[8]
   ------------------------------------------------------- 0x3000
        Boot Apps (flash.bin)
   ------------------------------------------------------- 0x10000
        1st Run Firmware
   ------------------------------------------------------- 0x200000
        2nd Run Firmware
   ------------------------------------------------------- 0x3F0000
        Configuration
   ------------------------------------------------------- 0x400000
*/

#define UNKNOWN_FIRM 0x0
#define BOOT_FIRM 0x1
#define RUN_FIRM 0x2
#define BOOT_RUN_FIRM 0x3
#define OLD_BASIC_FIRM 0x4

#define FLASH_BASE_ADDR 0x2800000
#define MAX_BOOTLOADER_CORE 0x3000
#define BOOT_APP_OFFSET (MAX_BOOTLOADER_CORE+sizeof(package_header_t))
#define BOOT_SYSPARAM_BASE  (MAX_BOOTLOADER_CORE-0x100) /* Don't Change */
#define BOOTLOADER_SIZE 0x10000
#define MAC_ADDRESS_OFFSET 0x2F80

#ifdef USE_FIRMWARE_ROLLBACK
#define BOOT_BASE_OFFSET        0x0
#define FIRST_RUN_FIRM_OFFSET   BOOTLOADER_SIZE
#define SECOND_RUN_FIRM_OFFSET  0x200000
#define MAX_FIRM_SIZE           0x1F0000
#else
#define BOOT_BASE_OFFSET        0x0
#define FIRST_RUN_FIRM_OFFSET   BOOTLOADER_SIZE
#define SECOND_RUN_FIRM_OFFSET          BOOTLOADER_SIZE
#define MAX_FIRM_SIZE           0x1E0000
#endif

typedef struct boot_params_s {
        char boot_magic[8];
#define BOOT_MAGIC_VAL "BTMAGIN"
        char alias[32];
        char version[16];
        unsigned int boot_crc;
        unsigned int boot_size;
        unsigned int flag;
#define UPGRADE_BOOT_LOADER 0x00000001
} boot_params_t;

#endif
