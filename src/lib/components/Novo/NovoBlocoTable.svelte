<script lang="ts">
	import File from 'lucide-svelte/icons/file';

	import ListFilter from 'lucide-svelte/icons/list-filter';

	import CirclePlus from 'lucide-svelte/icons/circle-plus';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import NovaSide from './NovoSide.svelte';
	import { Ellipsis } from 'lucide-svelte';
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<NovaSide />
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Tabs.Root value="all">
				<div class="flex items-center">
					<Tabs.List>
						<Tabs.Trigger value="all">All</Tabs.Trigger>
						<Tabs.Trigger value="active">Active</Tabs.Trigger>
						<Tabs.Trigger value="draft">Draft</Tabs.Trigger>
						<Tabs.Trigger value="archived" class="hidden sm:flex">Archived</Tabs.Trigger>
					</Tabs.List>
					<div class="ml-auto flex items-center gap-2">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button builders={[builder]} variant="outline" size="sm" class="h-7 gap-1">
									<ListFilter class="h-3.5 w-3.5" />
									<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Filter </span>
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Label>Filter by</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.CheckboxItem checked>Active</DropdownMenu.CheckboxItem>
								<DropdownMenu.CheckboxItem>Draft</DropdownMenu.CheckboxItem>
								<DropdownMenu.CheckboxItem>Archived</DropdownMenu.CheckboxItem>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<Button size="sm" variant="outline" class="h-7 gap-1">
							<File class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Export </span>
						</Button>
						<Button size="sm" class="h-7 gap-1">
							<CirclePlus class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Product </span>
						</Button>
					</div>
				</div>
				<Tabs.Content value="all">
					<Card.Root>
						<Card.Header>
							<Card.Title>Products</Card.Title>
							<Card.Description>
								Manage your products and view their sales performance.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head class="hidden w-[100px] sm:table-cell">
											<span class="sr-only">Image</span>
										</Table.Head>
										<Table.Head>Name</Table.Head>
										<Table.Head>Status</Table.Head>
										<Table.Head>Price</Table.Head>
										<Table.Head class="hidden md:table-cell">Total Sales</Table.Head>
										<Table.Head class="hidden md:table-cell">Created at</Table.Head>
										<Table.Head>
											<span class="sr-only">Actions</span>
										</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									<Table.Row>
										<Table.Cell class="hidden sm:table-cell">
											<img
												alt="Product example"
												class="aspect-square rounded-md object-cover"
												height="64"
												src="/images/placeholder.svg"
												width="64"
											/>
										</Table.Cell>
										<Table.Cell class="font-medium">Laser Lemonade Machine</Table.Cell>
										<Table.Cell>
											<Badge variant="outline">Draft</Badge>
										</Table.Cell>
										<Table.Cell>$499.99</Table.Cell>
										<Table.Cell class="hidden md:table-cell">25</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-07-12 10:42 AM</Table.Cell>
										<Table.Cell>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button
														aria-haspopup="true"
														size="icon"
														variant="ghost"
														builders={[builder]}
													>
														<Ellipsis class="h-4 w-4" />
														<span class="sr-only">Toggle menu</span>
													</Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content align="end">
													<DropdownMenu.Label>Actions</DropdownMenu.Label>
													<DropdownMenu.Item>Edit</DropdownMenu.Item>
													<DropdownMenu.Item>Delete</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell class="hidden sm:table-cell">
											<img
												alt="Product"
												class="aspect-square rounded-md object-cover"
												height="64"
												src="/images/placeholder.svg"
												width="64"
											/>
										</Table.Cell>
										<Table.Cell class="font-medium">Hypernova Headphones</Table.Cell>
										<Table.Cell>
											<Badge variant="outline">Active</Badge>
										</Table.Cell>
										<Table.Cell>$129.99</Table.Cell>
										<Table.Cell class="hidden md:table-cell">100</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-10-18 03:21 PM</Table.Cell>
										<Table.Cell>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button
														builders={[builder]}
														aria-haspopup="true"
														size="icon"
														variant="ghost"
													>
														<Ellipsis class="h-4 w-4" />
														<span class="sr-only">Toggle menu</span>
													</Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content align="end">
													<DropdownMenu.Label>Actions</DropdownMenu.Label>
													<DropdownMenu.Item>Edit</DropdownMenu.Item>
													<DropdownMenu.Item>Delete</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell class="hidden sm:table-cell">
											<img
												alt="Product"
												class="aspect-square rounded-md object-cover"
												height="64"
												src="/images/placeholder.svg"
												width="64"
											/>
										</Table.Cell>
										<Table.Cell class="font-medium">AeroGlow Desk Lamp</Table.Cell>
										<Table.Cell>
											<Badge variant="outline">Active</Badge>
										</Table.Cell>
										<Table.Cell>$39.99</Table.Cell>
										<Table.Cell class="hidden md:table-cell">50</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-11-29 08:15 AM</Table.Cell>
										<Table.Cell>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button
														builders={[builder]}
														aria-haspopup="true"
														size="icon"
														variant="ghost"
													>
														<Ellipsis class="h-4 w-4" />
														<span class="sr-only">Toggle menu</span>
													</Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content align="end">
													<DropdownMenu.Label>Actions</DropdownMenu.Label>
													<DropdownMenu.Item>Edit</DropdownMenu.Item>
													<DropdownMenu.Item>Delete</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell class="hidden sm:table-cell">
											<img
												alt="Product"
												class="aspect-square rounded-md object-cover"
												height="64"
												src="/images/placeholder.svg"
												width="64"
											/>
										</Table.Cell>
										<Table.Cell class="font-medium">TechTonic Energy Drink</Table.Cell>
										<Table.Cell>
											<Badge variant="secondary">Draft</Badge>
										</Table.Cell>
										<Table.Cell>$2.99</Table.Cell>
										<Table.Cell class="hidden md:table-cell">0</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2023-12-25 11:59 PM</Table.Cell>
										<Table.Cell>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button
														builders={[builder]}
														aria-haspopup="true"
														size="icon"
														variant="ghost"
													>
														<Ellipsis class="h-4 w-4" />
														<span class="sr-only">Toggle menu</span>
													</Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content align="end">
													<DropdownMenu.Label>Actions</DropdownMenu.Label>
													<DropdownMenu.Item>Edit</DropdownMenu.Item>
													<DropdownMenu.Item>Delete</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell class="hidden sm:table-cell">
											<img
												alt="Product"
												class="aspect-square rounded-md object-cover"
												height="64"
												src="/images/placeholder.svg"
												width="64"
											/>
										</Table.Cell>
										<Table.Cell class="font-medium">Gamer Gear Pro Controller</Table.Cell>
										<Table.Cell>
											<Badge variant="outline">Active</Badge>
										</Table.Cell>
										<Table.Cell>$59.99</Table.Cell>
										<Table.Cell class="hidden md:table-cell">75</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2024-01-01 12:00 AM</Table.Cell>
										<Table.Cell>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button
														builders={[builder]}
														aria-haspopup="true"
														size="icon"
														variant="ghost"
													>
														<Ellipsis class="h-4 w-4" />
														<span class="sr-only">Toggle menu</span>
													</Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content align="end">
													<DropdownMenu.Label>Actions</DropdownMenu.Label>
													<DropdownMenu.Item>Edit</DropdownMenu.Item>
													<DropdownMenu.Item>Delete</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell class="hidden sm:table-cell">
											<img
												alt="Product"
												class="aspect-square rounded-md object-cover"
												height="64"
												src="/images/placeholder.svg"
												width="64"
											/>
										</Table.Cell>
										<Table.Cell class="font-medium">Luminous VR Headset</Table.Cell>
										<Table.Cell>
											<Badge variant="outline">Active</Badge>
										</Table.Cell>
										<Table.Cell>$199.99</Table.Cell>
										<Table.Cell class="hidden md:table-cell">30</Table.Cell>
										<Table.Cell class="hidden md:table-cell">2024-02-14 02:14 PM</Table.Cell>
										<Table.Cell>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger asChild let:builder>
													<Button
														builders={[builder]}
														aria-haspopup="true"
														size="icon"
														variant="ghost"
													>
														<Ellipsis class="h-4 w-4" />
														<span class="sr-only">Toggle menu</span>
													</Button>
												</DropdownMenu.Trigger>
												<DropdownMenu.Content align="end">
													<DropdownMenu.Label>Actions</DropdownMenu.Label>
													<DropdownMenu.Item>Edit</DropdownMenu.Item>
													<DropdownMenu.Item>Delete</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Card.Content>
						<Card.Footer>
							<div class="text-xs text-muted-foreground">
								Showing <strong>1-10</strong> of <strong>32</strong> products
							</div>
						</Card.Footer>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</main>
	</div>
</div>
