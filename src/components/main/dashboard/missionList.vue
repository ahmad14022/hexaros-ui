<template>
    <div id="missionlist" class="card">
        <div class="flex flex-2 sm:flex-col md:flex-row gap-70% p-1">
            <small class="text-gray-700 font-bold tracking-wider">Mission List</small>
            <img class="items-center align-items-end
                        hover:scale-150 cursor-pointer" src="assets/icons/speed/plus.svg" />
        </div>
        <ul id="list">
            <li v-for="item in items">
                {{ item.message }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [
                { message: 'Mission 1' },
                { message: 'Mission 2' },
                { message: 'Mission 3' },
            ]
        }

    }
}
</script>
