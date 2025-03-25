<script setup lang="ts">
import type {InventoryItemInterface} from "@/stores/useInventoryStore.ts";
import {computed} from "vue";

const definedProps = defineProps<{
  item: InventoryItemInterface
}>()

const getItemSrc = computed<string>(() => {
  return `./src/assets/images/${definedProps.item.srcImg}`
})
</script>

<template>
  <picture><img :src="getItemSrc" alt="item-icon"></picture>
  <span class="item__count text--small">{{item.count}}</span>
</template>

<style lang="scss">
.item__count {
  position: absolute;
  bottom: 0;
  right: 0;
  border-top: 1px solid $border-color;
  border-left: 1px solid $border-color;
  border-top-left-radius: 6px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255,255,255,.4 )
}
</style>