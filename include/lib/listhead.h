#ifndef __LIST_HEAD_H
#define __LIST_HEAD_H
typedef struct list_head_s {
        int count;
        void *head;
        void *tail;
} list_head_t;

#endif
