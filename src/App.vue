<script setup lang="ts">
import {useInventoryStore} from "@/stores/useInventoryStore.ts";
import {storeToRefs} from "pinia";
import {onMounted, ref, toRaw} from "vue";

import {isInventoryItem} from "@/stores/useInventoryStore.ts";
import {useSaveStore} from "@/composables/useSaveStore.ts";
import {useGetStore} from "@/composables/useGetStore.ts";
import type {InventoryItemInterface} from "@/stores/useInventoryStore.ts";

import InventoryItem from "@/components/InventoryItem.vue";
import ItemWindow from "@/components/ItemWindow.vue";

const inventoryStore = useInventoryStore()
const {inventory, itemSubWindowVisibility, emptyItem} = storeToRefs(inventoryStore)

const activeItem = ref<InventoryItemInterface | undefined>(undefined)
const draggableItem = ref<InventoryItemInterface | undefined>(undefined)


onMounted(() => {
  useGetStore(inventoryStore)
})

inventoryStore.$subscribe((mutation, state) => {
  useSaveStore(inventoryStore)
})

const setActiveItem = (newItem: InventoryItemInterface) => {
  itemSubWindowVisibility.value = true
  activeItem.value = newItem
}
const dragItem = (item: InventoryItemInterface) => {
  draggableItem.value = item
}
const dropItem = (event: DragEvent) => {
  const target = event.target as HTMLElement

  if (!isInventoryItem(draggableItem.value)) return
  if (!target.dataset.id) return

  const newItemId = +target.dataset.id

  if (isInventoryItem(inventory.value.find(item => item.id === newItemId))) return;

  emptyItem.value.id = draggableItem.value.id
  draggableItem.value.id = newItemId
  draggableItem.value.position = +newItemId+1

  inventory.value.splice(newItemId, 1, draggableItem.value)
  inventory.value.splice(emptyItem.value.id, 1, structuredClone(toRaw(emptyItem.value)))

  draggableItem.value = undefined
}

const clearStore = () => {
  localStorage.removeItem('inventory')
}
</script>

<template>
  <main>
    <div class="container">
      <div class="block block--left">
        <picture>
          <img src="./assets/images/img-placeholder.png" alt="img-placeholder">
        </picture>

        <div class="text pulse">
          <h3>Lorem ipsum dolor sit.</h3>
          
          <div class="text__block">
            <p>Lorem ipsum dolor.</p>
            <p>Lorem ipsum dolor sit amet.</p>
            <p>Lorem ipsum dolor.</p>
            <p>Lorem ipsum.</p>
            <p>Lorem ipsum dolor sit.</p>
          </div>

          <p>Lorem ipsum</p>
        </div>
        
      </div>

      <div class="inventory__container">
        <ul class="block inventory">
          <li class="inventory__item"
              v-for="(item, index) of inventory"
              :key="item.id"
              :data-id="index"
              :class="{'--pointer': isInventoryItem(item)}"
              @click="setActiveItem(item)"
              draggable="true"
              @dragover.prevent
              @dragstart="dragItem(item)"
              @drop="dropItem($event)"
          >

            <InventoryItem v-if="isInventoryItem(item)" :item="item"  />
          </li>
        </ul>

        <ItemWindow :activeItem="activeItem" v-model:item-subWindow-visibility="itemSubWindowVisibility"/>
      </div>

      <div class="block block--bottom">
        <span class="close">
          <img src="@/assets/images/cross.svg" alt="cross-icon">
        </span>

        <div class="text pulse">
          <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet cum esse magni minima non provident quae, recusandae sed temporibus.</h3>
        </div>

        <button type="button" class="button button--small button--white clear-store"
                @click="clearStore">Сбросить стор</button>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
main {
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
}
.block {
  padding: 18px;
  background-color: $second-color;
  border-radius: $radius;
  border: 1px solid $border-color;

  &--left {
    padding: 18px 14px 24px;
    flex: 0 1 234px;
  }
  &--bottom {
    padding-right: 68px;
    width: 100%;
    position: relative;

    .text {
      padding: 0;
    }
  }
  &--aside {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: 250px;
    width: 250px;
    border-left: 1px solid $border-color;
    padding: 55px 15px 18px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.inventory {
  display: grid;
  grid-template-columns: repeat(5, 105px);
  padding: 0;

  &__container {
    flex: 1 1 auto;
    position: relative;
    overflow: hidden;
  }
  &__item {
    height: 100px;
    padding: 10px;
    border-bottom: 1px solid $border-color;
    border-right: 1px solid $border-color;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__item:nth-child(5n) {
    border-right: none;
  }

  &__item:nth-last-child(-n+5) {
    border-bottom: none;
  }
}
.clear-store {
  margin-top: 10px;
}
</style>
