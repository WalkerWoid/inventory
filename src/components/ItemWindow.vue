<script setup lang="ts">
import {useInventoryStore} from "@/stores/useInventoryStore.ts";
import {storeToRefs} from "pinia";
import {computed, ref, toRaw} from "vue";

import {isInventoryItem} from "@/stores/useInventoryStore.ts";
import type {InventoryItemInterface} from "@/stores/useInventoryStore.ts";

const inventoryStore = useInventoryStore()
const {itemSubWindowVisibility, inventory, emptyItem} = storeToRefs(inventoryStore)

const definedProps = defineProps<{
  activeItem: InventoryItemInterface | undefined
}>()
const countVisibility = ref<boolean>(false)
const inputCount = ref<number>(0)

const deleteItem = () => {
  if (!isInventoryItem(definedProps.activeItem)) return

  if (definedProps.activeItem.count - inputCount.value > 0)
    definedProps.activeItem.count -= inputCount.value
  else if (definedProps.activeItem.count - inputCount.value <= 0){
    emptyItem.value.id = definedProps.activeItem.id
    inventory.value.splice(definedProps.activeItem.position-1, 1, structuredClone(toRaw(emptyItem.value)))
    countVisibility.value = false
    itemSubWindowVisibility.value = false
  } else {
    return
  }
}

const getItemSrc = computed<string>(() => {
  return new URL(`../assets/images/${definedProps.activeItem.srcImg}`, import.meta.url).href;
})
</script>

<template>
  <Transition name="itemWindow">
    <aside class="block block--aside aside" v-if="itemSubWindowVisibility && isInventoryItem(activeItem)">
      <span class="close" @click="itemSubWindowVisibility = false">
        <img src="@/assets/images/cross.svg" alt="cross-icon">
      </span>

      <picture><img :src="getItemSrc" alt="item-img"></picture>

      <div class="text pulse">
        <h3>Lorem ipsum dolor sit amet, consectetur adipisicing.</h3>

        <div class="text__block">
          <p>Lorem ipsum dolor.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum.</p>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>

      <button class="button button--red" type="button" @click="countVisibility = true">Удалить предмет</button>

      <Transition name="count">
        <div class="count" v-show="countVisibility">
          <label>
            <input type="text" v-model="inputCount" placeholder="Введите количество" name="itemCount">
          </label>

          <div class="buttons__container">
            <button type="button" class="button button--small button--white" @click="countVisibility = false">
              Отмена
            </button>
            <button type="button" class="button button--small button--red" @click="deleteItem">
              Подтвердить
            </button>
          </div>
        </div>
      </Transition>
    </aside>
  </Transition>
</template>

<style lang="scss">
.block--aside {
  picture {
    height: 130px;
    width: 130px;
    display: flex;
    justify-content: center;
    margin: 0 auto;

    img {
      width: 100%;
      max-width: 100%;
      height: auto;
    }
  }
}
.aside {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .button {
    margin-top: auto;
  }
}
.close {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
}
.count {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 20px;
  z-index: 2;
  background-color: $second-color;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid $border-color;
}
.buttons__container {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.count-enter-active,
.count-leave-active {
  transition-duration: $transition;
}
.count-enter-to,
.count-leave-from {
  transform: translateY(0);
}
.count-enter-from,
.count-leave-to {
  transform: translateY(100%);
}

.itemWindow-enter-active,
.itemWindow-leave-active {
  transition-duration: $transition;
}
.itemWindow-enter-to,
.itemWindow-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.itemWindow-enter-from,
.itemWindow-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>